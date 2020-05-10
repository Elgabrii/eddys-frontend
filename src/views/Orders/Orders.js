import React, { Component } from 'react';
import {
  Base
} from './Orders.style';
import Order from '../../components/Order/Order';
import {
  GET,
  baseURL,
  headers
} from '../../api/api';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './Orders.scss'

// const useStyles =
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
    orderItems:[]
  }
  componentDidMount() {
    let { skip, limit } = this.state
    this.fetchOrders(skip,limit)
  }

  fetchOrders = async (skip, limit) => {
    try {
      let res = await GET(`${baseURL}/order?skip=${skip}&limit=${limit}`)
      let orders = res.data.results
      let count = res.data.count
      let pages = Math.ceil(count/30)
      let ids = []
      for (let i = 0; i < orders.length; i++) {
        if(orders[i].products) {
          let products = orders[i].products
          for (let j = 0; j < products.length; j++) {
            // ids.push(products[j])
          }
        }
      }
      console.log('ids', ids)
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
    this.setState({page: value})
  }

  fetchProductInfo = async (id) => {
    return await GET(`${baseURL}/products/${id}`, headers)
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
      console.log(selectedOrder, 'selectedORder')
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

  render() {
    let { orders, pages, page, panelExpanded, orderItems } = this.state
    return (
      <Base>
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
                  <Typography className={classes.heading}>Order #1</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className={classes.secondaryHeading}>
                    <b>Client:</b> 
                  </Typography>
                  <Typography>
                    {order.user&&order.user.name}
                  </Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                  <Typography>
                  <Typography>
                    <b>Phone Number:</b> 
                  </Typography>
                  <Typography>
                    {order.user&&order.user.phoneNumber}
                  </Typography>
                  </Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                  <Typography>
                  <Typography>
                    <b>Email:</b> 
                  </Typography>
                  <Typography>
                    {order.auth&&order.auth.email}
                  </Typography>
                  </Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                  <Typography>
                    <b>Amount: </b> 
                  </Typography>
                  <Typography>
                    {' '+order.amount} EGP
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
