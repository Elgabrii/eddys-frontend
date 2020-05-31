import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Flex } from '@rebass/grid';
import { api } from '../../api/api';
class Categories extends Component {
  state = {
    categories: [],
    name: "",
    loading: false,
  }
  componentDidMount() {
    this.fetchCategories()
  }
  addCategory = async() => {
    this.setState({loading: true})
    try {
      await api.post('/category', {
        name: this.state.name,
        loading: false,
      })
      this.fetchCategories()
    }
    catch(err) {
      throw err
    }
  }
  fetchCategories = async() => {
    try {
      let res = await api.get('/category')
      this.setState({categories: res.data})
    }
    catch(err) {
      throw err
    }
  }
  handleNameChange = (e) => {
    this.setState({name: e.target.value})
  }
  render() {
    let { categories, name, loading } = this.state
    return (
      <Flex flexDirection="column">
        <Flex mt={3} mb={4} height="30px" alignItems="center">
          <TextField value={name} onChange={this.handleNameChange} id="standard-basic" label="Category Name" />
          <Flex height="28px">
            <Button variant="contained" color="primary" onClick={this.addCategory} disabled={name.length===0 || loading}> 
              Add!
            </Button>
          </Flex>
        </Flex>
        {
          categories&&categories.map(category => <div>{category.name}</div>)
        }
      </Flex>
    );
  }
}

export default Categories;
