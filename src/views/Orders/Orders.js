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
import CsvDownload from 'react-json-to-csv'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
    zones:[],
    selectedZone: "",
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
    salesLoading: false,
  }
  interval = null
  componentDidMount() {
    let { skip, limit } = this.state
    this.fetchOrders(skip,limit)
    this.getZones()
    this.interval = setInterval(() => this.fetchOrders(skip,limit), 60000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getZones = async() => {
    let url = `${baseURL}/zone`
    try {
      let res = await api.get(url)
      let zones = res.data
      this.setState({zones})
    }
    catch(err) {
      throw err
    }
  }

  fetchOrders = async (skip, limit) => {
    this.setState({ordersLoading: true})
    let start = this.state.startDate
    let end = this.state.endDate
    let zone = this.state.selectedZone
    let zoneQueryString = zone ? `&city=${zone}` : ''
    // or=[{"status":"paid"}]
    // where={"status":"paid"}
    // or=[{"status":"pending", "method": "cash"},{"status": ["paid", "completed"]}]
    try {
      let res = await api.get(`${baseURL}/order?skip=${skip}&limit=${limit}${zoneQueryString}&startDate=${start}&endDate=${end}&or=[{"status":"pending", "method": "cash"},{"status": ["paid", "completed"]}]&sort=createdAt DESC`)
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
  json2csv = (json) => {
    // you can skip this step if your input is a proper array anyways:
    const simpleArray = JSON.parse(json)
    // in array look for the object with most keys to use as header
    const header = simpleArray.map((x) => Object.keys(x))
      .reduce((acc, cur) => (acc.length > cur.length ? acc : cur), []);

    // specify how you want to handle null values here
    const replacer = (key, value) => (
      value === undefined || value === null ? '' : value);
    let csv = simpleArray.map((row) => header.map(
      (fieldName) => JSON.stringify(row[fieldName], replacer)).join(','));
    csv = [header.join(','), ...csv];
    return csv.join('\r\n');
}
downloadCSV = (csvStr, name="invoice") => {
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/plain;charset=utf-8,' + encodeURI(csvStr);
  hiddenElement.target = '_blank';
  hiddenElement.download = `${name}.txt`
  hiddenElement.click();
}

generateInvoice = (order) => {
  console.log(order, 'orderr')
  let {orderItems} = this.state
  let items = orderItems&&orderItems.reduce(
    (acc, item) => acc+=`${item.quantity || ''} x ${item.nameEnglish || 'no name'} ${item.price*item.quantity || ''} EGP \n`,''
  )
  let invoice = `
    received at : ${new Date(order.createdAt).toLocaleString('en-GB').toString()} \n
    client: ${order.user&& order.user.name} \n
    phone number: ${order.user&&order.user.phoneNumber} \n
    email : ${order.auth&&order.auth.email} \n
    payment method: ${order.method} \n
    amount: ${order.amount} \n
    order items: \n
      ${items}
    Address Details: \n
      Zone: ${order.city || ''} \n
      Street: ${order.street || ''} \n
      Building: ${order.building || ''} \n
      Floor: ${order.floor || ''} \n
      Apartment: ${order.appartment || ''} \n
      Landmark: ${order.landmark || ''} \n
      Note: ${order.notes || ''} \n
  `
  this.downloadCSV(invoice)
}

exportCashSales = () => {
  let { orders } = this.state
  let completedCashOrders = orders.filter(order => order.method==='cash' && order.status==='completed')
  this.exportSales(completedCashOrders)
}
exportCreditSales = () => {
  let { orders } = this.state
  let completedCreditOrders = orders.filter(order => order.method==='we-accept' && order.status==='paid')
  this.exportSales(completedCreditOrders)
}
exportSales = async(orders) => {
  let resolvedProdmises
  let totalCash = 0;
  let creditStockReport = ''
  for (let i = 0; i < orders.length; i++) {
    const element = orders[i];
    let products = element&&element.products
    let productsIds = products.map(product => product.id)
    this.setState({salesLoading: true})
    let promises = await this.preparePromiseBulk(productsIds)
    resolvedProdmises = await this.resolveProductsPromises(promises)
    resolvedProdmises = resolvedProdmises.map(product => ({nameEnglish: product.nameEnglish, price: product.price}))
    products = products.map((product, index) => ({...resolvedProdmises[index],...product}))
    let items = products.reduce((acc, item) => {
      return acc+=`${item.quantity || ''} x ${item.nameEnglish || 'no name'} ${item.price*item.quantity || ''} EGP \n`
    },'')
    totalCash += element.amount
    creditStockReport+= `
    received at : ${new Date(element.createdAt).toLocaleString('en-GB').toString()} \n
    client: ${element.user&& element.user.name} \n
    phone number: ${element.user&&element.user.phoneNumber} \n
    email : ${element.auth&&element.auth.email} \n
    payment method: ${element.method} \n
    amount: ${element.amount} \n
    order items: \n
      ${items}
      Address Details: \n
      Zone: ${element.city || ''} \n
      Street: ${element.street || ''} \n
      Building: ${element.building || ''} \n
      Floor: ${element.floor || ''} \n
      Apartment: ${element.appartment || ''} \n
      Landmark: ${element.landmark || ''} \n
      Note: ${element.notes || ''} \n
      -------------------------------------------------------------- \n
    `
    // console.log(creditStockReport, 'current')
    element.products = products
  }
  // console.log(completedCreditOrders, 'completed')
  creditStockReport = `Total Cash: ${totalCash} EGP\n
  Number of orders: ${orders.length} \n
  ${creditStockReport}
  `
  this.setState({salesLoading: false})
  this.downloadCSV(creditStockReport, 'credit_sales')

}

preparePromiseBulk = (ids) => ids.map(id => this.fetchProductInfo(id))

setZone = (event) => {
  let {skip, limit} = this.state
  this.setState({selectedZone: event.target.value}, () => this.fetchOrders(skip, limit))
}

generateConsumedStock = async() => {
  let { orders } = this.state
  let productsArray = orders.reduce((acc, currentOrder) => [...acc, ...currentOrder.products],[]).map(product => ({...product, quantity: parseInt(product.quantity)}))
  let stockConsumed = {}
  for (let i = 0; i < productsArray.length; i++) {
    const element = productsArray[i];
    if(element.id in stockConsumed) {
      stockConsumed[element.id] = stockConsumed[element.id] + element.quantity
    } else {
      stockConsumed = {
        ...stockConsumed,
        [element.id] : element.quantity
      }
    }
  }
  let productsPromises = Object.keys(stockConsumed).map((id) => this.fetchProductInfo(id))
  
  let productData = (await this.resolveProductsPromises(productsPromises)).map(product => ({id: product.id, name: product.nameEnglish, quantity: stockConsumed[product.id]}))
  let stockReport = productData.reduce((acc, curr) => acc+= `${curr.name}: ${curr.quantity} \n`,'')
  // let response = productData.map((orderItem, index) => ({...orderItem}))
  this.downloadCSV(stockReport, 'stock_report')
  // console.log(response,' ress')

  // let products = orders.map()

}

  render() {
    let { orders, pages, page, selectedZone, zones, ordersLoading, error, panelExpanded, orderItems, buttonLoading, endDate, startDate, ordersCount, salesLoading } = this.state
    return (
      <Base>
      <button onClick={this.generateConsumedStock}>Export stock</button>
    <button disabled={salesLoading} onClick={this.exportCreditSales}>{salesLoading ? 'Loading...' : 'Export Credit Sales'}</button>
    <button disabled={salesLoading} onClick={this.exportCashSales}>{salesLoading ? 'Loading...' : 'Export Cash Sales'}</button>
      <Flex flexDirection="column" alignItems="flex-start" width={1}>
       End date <DatePicker
          selected={endDate}
          onChange={this.handleEndDateChange}
        />
       Start date <DatePicker
          selected={startDate}
          onChange={this.handleStartDateChange}
        />
              {/* <CircularProgress /> */}
        <hr></hr>
        Zone:      
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedZone}
          placeholder="select zone"
          onChange={this.setZone}
        >
          {
            zones&&zones.map((zone) => (
              <MenuItem value={zone.name}>{zone.name}</MenuItem>
            ))
          }
        </Select>
      </Flex>
        {
          error?<h3>an error has occured</h3> : 
            ordersLoading? <CircularProgress /> : 
            <>
            <h5>Orders Count: {ordersCount}</h5>
            {
              orders&&orders.filter(order => order.status === 'paid'|| order.status==="completed" || (order.status==='pending'&&order.method==="cash")).map((order, index) => {
                return (
                  <div key={order.id} className="root">
                   <ExpansionPanel width={1} expanded={panelExpanded===index} onChange={() => this.setPanelExpanded(index, order)}>
                     <ExpansionPanelSummary
                       expandIcon={<ExpandMoreIcon />}
                       aria-controls="panel1bh-content"
                       id="panel1bh-header"
                     >
                       <Typography className={classes.heading}>Order: <b>{order.id}</b></Typography>
                       <Typography className={classes.heading}>( {order.status} )</Typography>
                     </ExpansionPanelSummary>
                     <ExpansionPanelDetails>
                       
                       <Typography>
                         <Typography className={classes.secondaryHeading}>
                           <b>Order received at: {new Date(order.createdAt).toLocaleString('en-GB').toString()} {new Date(order.createdAt).toLocaleTimeString().toString()}</b> <button onClick={()=>this.generateInvoice(order)}>Export order invoice</button>
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
                           {
                              order.method == 'we-accept' ? <>
                                <b>Order Transaction Payment Merchant id:</b> {order.id}
                              </> : ''
                           }
                         </Typography>
                         <Typography>
                           <b>Amount: </b> {order.amount || '0'} EGP
                         </Typography>
                         <Typography>
                           <b>Delivery Time: </b> {order.orderDeliveryTime || ''}
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
                             District: {order.city || ''}
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
                           <Typography>
                             client notes: {order.notes || ''}
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