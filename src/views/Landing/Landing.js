import React, { Component } from 'react';
import { Flex } from '@rebass/grid';
import Sidebar from '../../components/Sidebar/Sidebar';
import Products from '../Products/Products';
import Orders from '../Orders/Orders';
// import Header from '../../components/Header';
import {
  SidebarContainer,
  SidebarItem,
  StyledLink,
  Base
} from './Landing.style';
// import { BrowserRouter as Router, Route, Switch, Redirect, withRouter, Link } from 'react-router-dom';
// import Order from '../Order/Order';
// import { connect } from 'react-redux';
// import { loadCats } from '../../store/actions/cats';
// import { bindActionCreators } from 'redux';
// import AllOrders from '../AllOrders/AllOrders';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter, Link, useRouteMatch } from 'react-router-dom'
import Routes from '../../routes';
import { Product } from '../Products/Products.style';
const Hello = () => <h1>hello</h1>
const MenuLink = ({ label, to, activeOnlyWhenExact}) => {
  let match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact
  })
  return <Link to={to}>{label}</Link>
}

export class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sideBarItems: [
        {
          id: 0,
          name: 'Products',
          // icon: require('../../Assets/icon-sales.svg'),
          url: '/'
        },
        {
          id: 1,
          name: 'Orders',
          // icon: require('../../Assets/icon-sales.svg'),
          url: '/orders'
        },
      ]
    }
  }
  componentDidMount() {
    // this.props.history.push('/orders')
  }

  render() {
    const { sideBarItems: items } = this.state
    // const { location } = this.props
    return (
      <>
        {/* <Header /> */}
        <Base p={0} width={1}>
            <Router>
          <SidebarContainer width={1 / 8} flexDirection="column">

            
            <Sidebar>
              {
                ({selectedItem, select}) => (
                  <React.Fragment>
                    {
                      items.map(item => (
                        <MenuLink to={item.url} label={item.name} activeOnlyWhenExact={true}>
                          <SidebarItem
                            data-testid="sidebar-item"
                            alignItems="center"
                            key={item.id}
                            onClick={() => select(item)}
                            selected={selectedItem === item.id}
                          >
                            <img src={item&&item.icon} alt=""/>
                            {item.name}
                          </SidebarItem>
                        </MenuLink>
                      ))
                    }
                  </React.Fragment>
                )
              }
            </Sidebar>
          </SidebarContainer>
          <Flex width={7 / 8} p={3}>
           {/* <Switch>
                  <Route exact path="/">
                    <Products></Products>
                  </Route>
                  <Route exact path="/orders"> 
                  </Route>
            </Switch> */}
                    <Orders></Orders>
          </Flex>
          </Router>
        </Base>
      </>
    );
  }
}

export default withRouter(Landing);
