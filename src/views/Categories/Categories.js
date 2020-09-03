import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { Flex } from '@rebass/grid';
import { api } from '../../api/api';
import { Category } from './Categories.style';
const categoryTypes = [
  {
    id: 1,
    type: "normal",
  },
  {
    id: 2,
    type: "catering"
  }
]
class Categories extends Component {
  state = {
    categories: [],
    cateringCategories: [],
    name: "",
    type: "normal",
    loading: false,
    editMode: false,
    selectedCategoryId: ''
  }
  componentDidMount() {
    this.fetchCategories()
    this.fetchCateringCategories()
  }
  addCategory = async() => {
    this.setState({loading: true})
    try {
      await api.post('/category', {
        name: this.state.name,
        type: this.state.type
      })
      this.setState({loading: false})
      this.fetchCategories()
      this.fetchCateringCategories()
    }
    catch(err) {
      throw err
    }
  }
  editExistingCategory = async() => {
    this.setState({loading: true})
    let { name, type, selectedCategoryId } = this.state
    try {
      await api.patch(`/category/${selectedCategoryId}`,{
        name,
        type 
      })
      this.setState({loading: false})
      this.fetchCateringCategories()
      this.fetchCategories()
    }
    catch(err) {
      throw err
    }
  }
  fetchCategories = async() => {
    try {
      let res = await api.get('/category?type=normal')
      this.setState({categories: res.data})
    }
    catch(err) {
      throw err
    }
  }
  fetchCateringCategories = async() => {
    try {
      let res = await api.get('/category?type=catering')
      this.setState({cateringCategories: res.data})
    }
    catch(err) {
      throw err
    }
  }
  handleNameChange = (e) => {
    this.setState({name: e.target.value})
  }
  handleCategoryTypeChange = e => {
    this.setState({type: e.target.value})
  }
  editCategory = category => {
    console.log(category,' catttegory')
    this.setState({
      name: category.name,
      type: category.type,
      selectedCategoryId: category.id,
      editMode: true
    })
  }
  render() {
    let { categories, cateringCategories, name, loading, type, editMode} = this.state
    return (
      <Flex flexDirection="column">
        <Flex mt={3} mb={4} height="30px" alignItems="center">
          <Flex my={3} m flexDirection="column">
            <TextField value={name} onChange={this.handleNameChange} id="standard-basic" label="Category Name" />
            <TextField
              id="standard-select-currency"
              select
              name="type"
              label=""
              value={type}
              onChange={this.handleCategoryTypeChange}
              helperText="Please select a category type"
            >
              {categoryTypes&&categoryTypes.map((option) => (
                <MenuItem key={option.id} value={option.type}>
                  {option.type}
                </MenuItem>
              ))}
            </TextField>
          </Flex>
          <Flex height="28px" ml={2}>
            {
              editMode?
              <Button variant="contained" color="primary" onClick={this.editExistingCategory} disabled={name.length===0 || loading}> 
                Edit
              </Button>
              :
              <Button variant="contained" color="primary" onClick={this.addCategory} disabled={name.length===0 || loading}> 
                Add
              </Button>
              
            }
          </Flex>
        </Flex>
        <Flex width={1}>
          <Flex flexDirection="column">
            <h3>Normal:</h3>
            {
              categories&&categories.map(category => <Category selected={category.id === this.state.selectedCategoryId} onClick={() => this.editCategory(category)}>{category.name}</Category>)
            }
          </Flex>
          <Flex flexDirection="column">
            <h3>Catering:</h3>
            {
              cateringCategories&&cateringCategories.map(category => <Category selected={category.id === this.state.selectedCategoryId} onClick={() => this.editCategory(category)}>{category.name}</Category>)
            }
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

export default Categories;
