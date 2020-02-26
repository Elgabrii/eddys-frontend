import React, { Component } from 'react'
import { Flex } from '@rebass/grid'
import Sidebar from '../../components/Sidebar/Sidebar'
import Products from '../Products/Products'
import Header from '../../components/Header/Header'
import {
  SidebarContainer,
  SidebarItem,
  StyledLink,
  Base
} from './Landing.style'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

export class Landing extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sideBarItems: [
        {
          id: 0,
          name: 'Products',
          // icon: require('../../Assets/icon-sales.svg'),
          url: '/dashboard/products'
        }
      ]
    }
  }
  componentDidMount () {
    // this.props.history.push('/orders')
  }

  render () {
    const { sideBarItems: items } = this.state
    // const { location } = this.props
    return (
      <>
        <Base p={0} width={1}>
          <SidebarContainer width={1 / 8} flexDirection='column'>
            <Sidebar>
              {({ selectedItem, select }) => (
                <React.Fragment>
                  {items.map(item => (
                    <StyledLink key={item.id} to={item.url}>
                      <SidebarItem
                        data-testid='sidebar-item'
                        alignItems='center'
                        key={item.id}
                        onClick={() => select(item)}
                        selected={selectedItem === item.id}
                      >
                        <Link
                          style={{
                            color: 'white',
                            textDecoration: 'unset',
                            padding: 5,
                            paddingLeft: 10
                          }}
                          to={item.url}
                        >
                          {item.name}
                        </Link>
                        <img src={item && item.icon} alt='' />
                      </SidebarItem>
                    </StyledLink>
                  ))}
                </React.Fragment>
              )}
            </Sidebar>
          </SidebarContainer>
          <Flex width={7 / 8} flexDirection='column'>
            <Flex p={3}>
              <Header />
            </Flex>
            <Flex p={3}>
              <Switch>
                {/* <Redirect to='/dashboard/products' /> */}
                <Route exact path='/dashboard/products' component={Products} />
              </Switch>
            </Flex>
          </Flex>
        </Base>
      </>
    )
  }
}
// const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       loadCats,
//     },
//     dispatch
//   );

export default Landing
