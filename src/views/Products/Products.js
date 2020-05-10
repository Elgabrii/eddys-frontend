import React, { Component } from 'react';
import { Headings, Base, ProductsContainer, ProductName, ImageContainer, Heading, Product, ProductPrice } from './Products.style';
// import ProductImage from '../../assets/bread.jpg';
import ProductModal from '../../components/ProdutModal/ProductModal';
import axios from 'axios';
import {headers, GET, baseURL, bareBaseURL} from '../../api/api';
import urls from '../../api/urls';
let ProductImage = `${baseURL}/file_uploads/f878db9e-ee2a-47bc-b87c-d78f6d83edd0.jpg`
export class Products extends Component {
  componentDidMount() {
    this.getProducts()
    this.getCategories()
  }
  state = {
    products:[],
    toggleModal: false, 
  }
  getProducts = async() => {
    try {
      const response = await GET(`${baseURL}/products`, headers);
      this.setState({products: response.data})
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
  toggleModal = () => {
    this.setState({
      toggleModal: true
    })
  }
  closeModal = () => this.setState({toggleModal: false})
  render() {
    let { products, toggleModal, categories } = this.state
    return (
      <Base width={1} flexDirection="column">
        <Headings justifyContent="space-between">
          <Heading>
            All products
          </Heading>
          <Heading onClick={this.toggleModal}>
            Add Product
          </Heading>
        </Headings>
        <ProductsContainer flexWrap="wrap" p={1}>
          {
            products.map(product => (
              <Product key={product.id} m={1} flexDirection="column">
              <ImageContainer>
                <img src={`${bareBaseURL}/${product&&product.images[0]&& product.images[0].link}`} alt="" />
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
         <ProductModal categories={categories} loadProducts={this.getProducts} toggle={toggleModal} closeModal={this.closeModal} />        
      </Base>
    );
  }
}

export default Products;
