import React, { Component } from 'react'
import { Flex } from '@rebass/grid'
import {
  withRouter,
} from 'react-router-dom'
import Routes from 'routes'
import {Base} from './Landing.style'

export class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sideBarItems: [
        {
          id: 0,
          name: 'Products',
          // icon: require('../../Assets/icon-sales.svg'),
          url: '/',
        },
        // {
        //   id: 1,
        //   name: 'Orders',
        //   // icon: require('../../Assets/icon-sales.svg'),
        //   url: '/orders'
        // },
      ],
    }
  }
  componentDidMount() {
    // this.props.history.push('/orders')
  }

  render() {
    return (
      <>
        <Base p={0} width={1}>
    
        </Base>
      </>
    )
  }
}

export default withRouter(Landing)
