import React, { Component } from 'react'
import Sidebar from '../../components/Sidebar'
import { sideBarItems } from './MainContainer.constants'
import { Flex } from '@rebass/grid'
import Routes from '../../routes'
import { withRouter } from 'react-router-dom'

import {
  SidebarContainer,
  SidebarItem,
  StyledLink,
  Base,
} from './MainContainer.style'

class MainContainer extends Component {
  renderSidebar = () => {
    return (
      <SidebarContainer width={1 / 8} flexDirection="column">
        <Sidebar>
          {({ selectedItem, select }) => (
            <>
              {sideBarItems.map((item) => (
                <StyledLink key={item.id} to={item.url}>
                  <SidebarItem
                    data-testid="sidebar-item"
                    alignItems="center"
                    key={item.id}
                    onClick={() => select(item)}
                    selected={selectedItem === item.url}
                  >
              
                    {item.name}
                  </SidebarItem>
                </StyledLink>
              ))}
            </>
          )}
        </Sidebar>
      </SidebarContainer>
    )
  }
  render() {
    let currentPage = this.props.history.location.pathname
    let loginProps = { justifyContent: 'center', width: 1 }
    let otherPagesProps = { width: 7 / 8 }
    let isLoginPage = currentPage == '/login'

    return (
      <div>
        <>
          <Base isLoginPage={isLoginPage} p={0} width={1}>
            {isLoginPage ? (
              <Flex {...loginProps}>
                <Routes />
              </Flex>
            ) : (
              <>
                {this.renderSidebar()}
                <Flex {...otherPagesProps}>
                  <Routes />
                </Flex>
              </>
            )}
          </Base>
        </>
      </div>
    )
  }
}

export default withRouter(MainContainer)
