import React, { Component } from 'react';

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
    }
  }
  select = (item) => {
    this.setState({selected: item.id})
  }
  render() {
    const { children } = this.props
    return children({
      selectedItem: this.state.selected,
      select: this.select
    })
  }
}

export default Sidebar;
