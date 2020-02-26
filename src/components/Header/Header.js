import React, { Component } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap'

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: 0
    }
  }
  toggle = () =>
    this.setState({
      isOpen: !this.state.isOpen
    })
  select = item => {
    this.setState({ selected: item.id })
  }
  render () {
    const { isOpen } = this.state
    return (
      <div>
        <Navbar color='light' light expand='md'>
          <NavbarBrand href='/'>reactstrap</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className='mr-auto' navbar>
              <NavItem>
                <NavLink href='/components/'>Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='https://github.com/reactstrap/reactstrap'>
                  GitHub
                </NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            <NavbarText>Simple Text</NavbarText>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}

export default Header
