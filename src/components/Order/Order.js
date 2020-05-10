import React, { Component } from 'react';
import {
  Base,
  Column
} from './Order.style';
class Order extends Component {
  render() {
    return (
      <Base>
        <Column>
          Client Name: {this.props.order&&this.props.order.user&&this.props.order.user.name}
        </Column>
        <Column>
          Client Phone Number: {this.props.order&&this.props.order.user&&this.props.order.user.phoneNumber}
        </Column>
        <Column>
          Payment-method: {this.props.order&&this.props.order.method}
        </Column>
        <Column>
          Status: {this.props.order&&this.props.order.status}
        </Column>
        
      </Base>
    );
  }
}

export default Order;
