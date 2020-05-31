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
    startDate: new Date(new Date().setDate(new Date().getDate() -3))
  }
  componentDidMount() {
    let { skip, limit } = this.state
    this.fetchOrders(skip,limit)
  }

  fetchOrders = async (skip, limit) => {
    try {
      let res = await api.get(`${baseURL}/order?skip=${skip}&limit=${limit}&startDate=${convertCalendarDate(this.state.startDate)}&endDate=${convertCalendarDate(this.state.endDate)}`)
      let orders = res.data.results
      let count = res.data.count
      let pages = Math.ceil(count/30)
      this.setState({orders, pages})
    }
    catch(err) {
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
    let { orders, pages, page, panelExpanded, orderItems, buttonLoading, endDate, startDate } = this.state
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
      </Flex>
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
        
          <Pagination count={pages} page={page} onChange={this.handlePaginationChange} color="primary" />
      </Base>
    );
  }
}




export default Orders;
