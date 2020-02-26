import React, { Component } from 'react';
import { Headings, Base, ProductsContainer, ProductName, ImageContainer, Heading, Product, ProductPrice } from './Products.style';
import ProductImage from '../../assets/bread.jpg';
import ProductModal from '../../components/ProdutModal/ProductModal';
import axios from 'axios';
import {headers, GET, baseURL} from '../../api/api';
export class Products extends Component {
  componentDidMount() {
    this.getProducts()
  }
  state = {
    products:[],
    toggleModal: false, 
  }
  // async function getUser() {
  //   try {
  //     const response = await axios.get('/user?ID=12345');
  //     console.log(response);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  getProducts = async() => {
    try {
      const response = await GET(`${baseURL}/products`, headers);
      this.setState({products: response.data})
    } catch (error) {
      console.error(error);
    }
  }
  toggleModal = () => {
    this.setState({
      toggleModal: true
    })
  }
  closeModal = () => this.setState({toggleModal: false})
  render() {
    let { products, toggleModal } = this.state
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
                <img src={ProductImage} alt="" />
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
         <ProductModal loadProducts={this.getProducts} toggle={toggleModal} closeModal={this.closeModal} />        
      </Base>
    );
  }
}

export default Products;