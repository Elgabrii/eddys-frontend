import React, { Component } from 'react';
import { Headings, Base, ProductsContainer, ProductName, ImageContainer, Heading, Product, ProductPrice, PaginationContainer } from './Products.style';
// import ProductImage from '../../assets/bread.jpg';
import ProductModal from '../../components/ProdutModal/ProductModal';
import axios from 'axios';
import {headers, GET, baseURL, bareBaseURL} from '../../api/api';
import urls from '../../api/urls';
import Pagination from '@material-ui/lab/Pagination';
let ProductImage = `${baseURL}/file_uploads/f878db9e-ee2a-47bc-b87c-d78f6d83edd0.jpg`
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
    edit: false
  }
  getProducts = async(skip=0, limit=30) => {
    try {
      const response = await GET(`${baseURL}/products?skip=${skip}&limit=${limit}`, headers);
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

  closeModal = () => this.setState({toggleModal: false})
  stopEdit = () => this.setState({edit: false})
  render() {
    let { products, toggleModal, categories, currentProduct, pages, page, edit } = this.state
    return (
      <Base height="95vh" alignItems="center" width={1} flexDirection="column">
        <Headings width={1} justifyContent="space-between">
          <Heading>
            All products
          </Heading>
          <Heading onClick={this.toggleModal} pointer>
            Add Product
          </Heading>
        </Headings>
        <ProductsContainer flexWrap="wrap" p={1}>
          {
            products.map(product => (
              <Product onClick={() => this.toggleModal(product, 'EDIT')} key={product.id} m={1} flexDirection="column">
              <ImageContainer>
                <img src={`http://eddys-kitchen.com:1337/file_uploads/${product&&product.images[0]&& product.images[0].link}`} alt="" />
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
