import React, { Component } from 'react';
import {
  Base
} from './Orders.style';
import Order from '../../components/Order/Order';
import {
  GET,
  baseURL,
  api
} from '../../api/api';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import './Orders.scss'
import Cookies from 'js-cookie';
import {Flex} from '@rebass/grid';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CircularProgress from '@material-ui/core/CircularProgress';


// const useStyles =
const convertCalendarDate = (date) => {
  // let date2 = date
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  // debugger
  return `${year}-${month}-${day}`
  // console.log(date,)
}
const classes = (() => ({
  root: {
    width: '100%',
  },
  heading: {
    // fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    // fontSize: theme.typography.pxToRem(15),
    color: 'grey',
  },
}))()
// let endd = new Date()
// let startt = endd - endd.getDate()-3
// debugger
class Orders extends Component {
  state = {
    orders: [],
    pages: 1,
    page: 1,
    skip: 0,
    limit: 30,
    offset: 30,
    panelExpanded: '',
    panelLoading: false,
    orderItems:[],
    buttonLoading: false,
    endDate: new Date(),
    startDate: new Date(new Date().setDate(new Date().getDate() -3)),
    ordersLoading: false,
    error: false,
  }
  componentDidMount() {
    let { skip, limit } = this.state
    this.fetchOrders(skip,limit)
  }

  fetchOrders = async (skip, limit) => {
    this.setState({ordersLoading: true})
    let start = this.state.startDate
    let end = this.state.endDate

    try {
      let res = await api.get(`${baseURL}/order?skip=${skip}&limit=${limit}&startDate=${start}&endDate=${end}&sort=createdAt DESC`)
      let orders = res.data.results
      let count = res.data.count
      let pages = Math.ceil(count/30)
      this.setState({orders, pages, ordersLoading: false, error: false, ordersCount: count})
    }
    catch(err) {
      this.setState({ordersLoading: false, error: true})
      throw err
    }
  }
  
  handlePaginationChange = (event, value) => {
    let { offset } = this.state
    let skip = (value-1)*offset
    let limit = value*offset
    this.fetchOrders(skip, limit)
    this.setState({page: value, skip, limit})
  }

  fetchProductInfo = async (id) => {
    return await GET(`${baseURL}/products/${id}`)
  }

  setPanelExpanded = async(index, selectedOrder) =>  {
    let { panelExpanded, panelLoading } = this.state
    let panelActive = panelExpanded === index
    // debugger
    if (panelActive) {
      this.setState(prevState => ({
        panelExpanded: '',
        panelLoading: false,
      }));
    } else {
      this.setState({
        panelExpanded: index,
        panelLoading: true,
      })
      // debugger
      let productsPromises = selectedOrder&&selectedOrder.products&&selectedOrder.products.map(({id}) => this.fetchProductInfo(id))
      let orderItems = await this.resolveProductsPromises(productsPromises)
      orderItems = orderItems&&orderItems.map((orderItem, index) => ({...orderItem, quantity: selectedOrder.products[index].quantity}))
      this.setState({orderItems: orderItems})
    }
  }
  completeCashPayment = async(order) => {
    this.setState({buttonLoading: true})
    let id = order.id
    await api.patch(`/order/${id}`, {
        status: 'completed'
    })
    window.location.reload()
  }

  resolveProductsPromises = async(promises) => {
    try {
      let resArr = await Promise.all(promises)
      if(resArr&&resArr.length)
      return resArr.map(response => response.data)
    }
    catch(err) {
      console.log(err)
    }
  }
  handleStartDateChange = (val) => {
    let { skip, limit } = this.state
    this.setState({startDate: val}, () => this.fetchOrders(skip, limit))
  }
  handleEndDateChange = (val) => {
    let { skip, limit } = this.state
    this.setState({endDate: val},() => this.fetchOrders(skip, limit))
  }
  render() {
    let { orders, pages, page, ordersLoading, error, panelExpanded, orderItems, buttonLoading, endDate, startDate, ordersCount } = this.state
    return (
      <Base>
      <Flex justifyContent="" width={1}>
       end date <DatePicker
          selected={endDate}
          onChange={this.handleEndDateChange}
        />
       start date <DatePicker
          selected={startDate}
          onChange={this.handleStartDateChange}
        />
              {/* <CircularProgress /> */}

      </Flex>
        {
          error?<h3>an error has occured</h3> : 
            ordersLoading? <CircularProgress /> : 
            <>
            <h5>Orders Count: {ordersCount}</h5>
            {
              orders&&orders.map((order, index) => {
                return (
                  <div key={order.id} className="root">
                   <ExpansionPanel width={1} expanded={panelExpanded===index} onChange={() => this.setPanelExpanded(index, order)}>
                     <ExpansionPanelSummary
                       expandIcon={<ExpandMoreIcon />}
                       aria-controls="panel1bh-content"
                       id="panel1bh-header"
                     >
                       <Typography className={classes.heading}>Order #{order.createdAt}</Typography>
                       <Typography className={classes.heading}>( {order.status} )</Typography>
                     </ExpansionPanelSummary>
                     <ExpansionPanelDetails>
                       <Typography>
                         <Typography className={classes.secondaryHeading}>
                           <b>Order received at: {new Date(order.createdAt).toLocaleTimeString().toString()}</b>
                         </Typography>
                         <Typography className={classes.secondaryHeading}>
                           <b>Client: </b>{order.user&&order.user.name}
                         </Typography>
                         <Typography>
                           <b>Phone Number: </b> {order.user&&order.user.phoneNumber}
                         </Typography>
                         <Typography>
                           <b>Email: </b> {order.auth&&order.auth.email}
                         </Typography>
                         <Typography>
                           <b>Order status: </b> {order.status}
                         </Typography>
                         <Typography>
                           <b>Payment method: </b> {
                           order.method == 'we-accept' ? order.method : (
                             <>
                               { order.method +' '} 
                               {
                                 order.status!="completed"? 
                               <Button variant="contained" onClick={() => this.completeCashPayment(order)} color="primary">
                                 {!buttonLoading? 'Complete Order' : 'Loading...'}
                               </Button> :
                               ''
                               }
                             </>
                           )
                           }
                         </Typography>
                         <Typography>
                           <b>Amount: </b> {order.amount || '0'} EGP
                         </Typography>
                         <Typography>
                           <b>Delivery Time: </b> {order.orderDeliveryTime || '0'} EGP
                         </Typography>
                       </Typography>
                     </ExpansionPanelDetails>
                     <ExpansionPanelDetails>
                       <Typography>
                         <Typography>
                           <b>Order Items:</b> 
                         </Typography>
                         <Typography>
                           {orderItems&&orderItems.map(item => <>
                           <p>{item.quantity || ''} x {item.nameEnglish || 'no name'} <b>{item.price*item.quantity || ''} EGP</b> </p>
                           </>
                           )}
                         </Typography>
                       </Typography>
                     </ExpansionPanelDetails>
                     {(order&&(order.street||order.landmark||order.floor||order.city||order.building))&& 
                       <ExpansionPanelDetails>
                         <Typography>
                           <Typography>
                             <b>Address Details:</b> 
                           </Typography>
                           <Typography>
                             Street: {order.street || ''}
                           </Typography>
                           <Typography>
                             Building: {order.building || ''}
                           </Typography>
                           <Typography>
                             Floor: {order.floor || ''}
                           </Typography>
                           <Typography>
                             apartment: {order.appartment || ''}
                           </Typography>
                           <Typography>
                             landmark: {order.landmark || ''}
                           </Typography>
                         </Typography>
                       </ExpansionPanelDetails>
                     }
                   </ExpansionPanel>
                   </div>
                ) 
               //  <Order order={order} />
               })
            }
            </>
            
          
        }
        
          <Pagination count={pages} page={page} onChange={this.handlePaginationChange} color="primary" />
      </Base>
    );
  }
}




export default Orders;


function convertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
          if (line != '') line += ','

          line += array[i][index];
      }

      str += line + '\r\n';
  }

  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
      items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = this.convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}


// function download(){
// var headers = {
//     model: 'Phone Model'.replace(/,/g, ''), // remove commas to avoid errors
//     chargers: "Chargers",
//     cases: "Cases",
//     earphones: "Earphones"
// };

// itemsNotFormatted = [
//     {
//         model: 'Samsung S7',
//         chargers: '55',
//         cases: '56',
//         earphones: '57',
//         scratched: '2'
//     },
//     {
//         model: 'Pixel XL',
//         chargers: '77',
//         cases: '78',
//         earphones: '79',
//         scratched: '4'
//     },
//     {
//         model: 'iPhone 7',
//         chargers: '88',
//         cases: '89',
//         earphones: '90',
//         scratched: '6'
//     }
// ];

// var itemsFormatted = [];

// // format the data
// itemsNotFormatted.forEach((item) => {
//     itemsFormatted.push({
//         model: item.model.replace(/,/g, ''), // remove commas to avoid errors,
//         chargers: item.chargers,
//         cases: item.cases,
//         earphones: item.earphones
//     });
// });

// var fileTitle = 'orders'; // or 'my-unique-title'

// exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
// }