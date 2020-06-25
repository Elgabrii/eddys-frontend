import React, { Component } from 'react';
import { Headings, Base, ProductsContainer, ProductName, ImageContainer, Heading, Product, ProductPrice, PaginationContainer } from './Products.style';
// import ProductImage from '../../assets/bread.jpg';
import ProductModal from '../../components/ProdutModal/ProductModal';
import axios from 'axios';
import {GET, baseURL, bareBaseURL, api} from '../../api/api';
import urls from '../../api/urls';
import Pagination from '@material-ui/lab/Pagination';
// let ProductImage = `${baseURL}/file_uploads/f878db9e-ee2a-47bc-b87c-d78f6d83edd0.jpg`
import TextField from '@material-ui/core/TextField';
import debounce from 'lodash.debounce';
import CircularProgress from '@material-ui/core/CircularProgress';

export class Products extends Component {
  componentDidMount() {
    this.getProducts()
    this.getCategories()
  }
  state = {
    products:[],
    toggleModal: false, 
    currentProduct: {},
    pages: 1,
    page: 1,
    offset: 30,
    skip: 0,
    limit: 30,
    edit: false,
    searchTerm: '',
    loading: false,
  }
  getProducts = async(skip=0, limit=30) => {
    try {
      const response = await GET(`${baseURL}/products?skip=${skip}&limit=${limit}`);
      const count = response.data.count
      this.setState({
        products: response.data.results,
        pages: Math.ceil(count/30)
      })
    } catch (error) {
      throw error
    }
  }

  getCategories = async() => {
    try {
      const response = await GET(`${baseURL}${urls.categories}`)
      this.setState({ categories: response.data })
    }
    catch(err) {
      throw err
    }
  }
  toggleModal = (product = {}, action) => {
    this.setState({
      toggleModal: true,
      currentProduct: product,
      edit: action==='EDIT'
    })
  }

  handlePaginationChange = (event, value) => {
    let { offset } = this.state
    let skip = (value-1)*offset
    let limit = value*offset
    this.getProducts(skip, limit)
    this.setState({page: value})
  }

  handleSearchTermChange = (e) => {
    let searchTerm = e.target.value
    // let body = { searchKey: searchTerm }
    // console.log(searchTerm)
    this.setState({
      searchTerm,
      loading: true,
    })
    if (searchTerm === '') return this.getProducts()
      this.getSearchProducts()
  }

  getSearchProducts = debounce(() => {
    let body = this.state.searchTerm
    api.post(`/products/searchProducts`, {
      searchKey: body
    }).then((response) => {
      console.log('res', response)
      if (response && response.data) {
        this.setState({
          products: response.data,
          count: response.data.length,
          loading: false,
        })
      }
    })
  }, 500)


  closeModal = () => this.setState({toggleModal: false})
  stopEdit = () => this.setState({edit: false})
  render() {
    let { products, toggleModal, categories, currentProduct, pages, page, edit, loading } = this.state
    return (
      <Base height="100%" alignItems="center" width={1} flexDirection="column">
        <Headings width={1} justifyContent="space-between">
          <Heading>
            All products 
          </Heading>
            <TextField id="standard-basic" label="search products" onChange={this.handleSearchTermChange} />
          <Heading onClick={this.toggleModal} pointer>
            Add Product
          </Heading>
        </Headings>
        <ProductsContainer flexWrap="wrap" p={1}>
          {
            loading? <CircularProgress /> :
            products.map(product => (
              <Product onClick={() => this.toggleModal(product, 'EDIT')} key={product.id} m={1} flexDirection="column">
              <ImageContainer>
                <img src={`https://backend.eddys-kitchen.com/${product&&product.images[0]&& product.images[0].link}`} alt="" />
              </ImageContainer>
                <ProductName>
                  {product.nameEnglish}
                </ProductName>
                <ProductPrice>
                  {product.price} EGP
                </ProductPrice>
              </Product>                
            ))
          }
        </ProductsContainer>
         <ProductModal stopEdit={this.stopEdit} categories={categories} {...currentProduct} edit={edit} loadProducts={this.getProducts} toggle={toggleModal} closeModal={this.closeModal} />
         <PaginationContainer>
          <Pagination count={pages}  page={page} onChange={this.handlePaginationChange} color="primary" />
         </PaginationContainer>
      </Base>
    );
  }
}

export default Products;
