import React, { Component } from 'react'
import { Flex } from '@rebass/grid'
import Sidebar from '../../components/Sidebar/Sidebar'
// import Header from '../../components/Header';
import {} from './Login.style'

export class Login extends Component {
  constructor (props) {
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
  componentDidMount () {}

  render () {
    const { sideBarItems: items } = this.state
    return (
      <>
        <div>HIHI</div>
      </>
    )
  }
}

export default Login
