import React, { Component } from 'react';
import { Flex } from '@rebass/grid';
import Sidebar from '../../components/Sidebar/Sidebar';
import Products from '../Products/Products';
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

export class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sideBarItems: [
        {
          id: 0,
          name: 'Orders',
          // icon: require('../../Assets/icon-sales.svg'),
          url: '/'
        }
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
          <SidebarContainer width={1 / 8} flexDirection="column">
            <Sidebar>
              {
                ({selectedItem, select}) => (
                  <React.Fragment>
                    {
                      items.map(item => (
                        <StyledLink key={item.id} to={item.url}>
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
                        </StyledLink>
                      ))
                    }
                  </React.Fragment>
                )
              }
            </Sidebar>
          </SidebarContainer>
          <Flex width={7 / 8} p={5}>
              <Products></Products>
          </Flex>
        </Base>
      </>
    );
  }
}
// const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       loadCats,
//     },
//     dispatch
//   );

export default Landing;
