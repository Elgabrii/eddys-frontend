import React, { Component } from 'react';
import { Base, ModalBody, Label, ModalRow, InputText, Button } from './ProductModal.style';
import { POST, GET, headers } from '../../api/api';
import urls from '../../api/urls';
export class ProductModal extends Component {
  state = {
    nameEnglish: '',
    nameArabic: '',
    descriptionEnglish: '',
    descriptionArabic: '',
    price: '',
    quantity: '',
  }
  closeModal = () => {
    this.props.closeModal()
  }
  submit = async () => {
    try {
      await POST(`${urls.base}${urls.products}`, this.state, headers)
      this.props.loadProducts()
      this.closeModal()
      // await GET(`${urls.base}${urls.products}`, headers)
    }
    catch(err) {
      console.log(err)
    }
  }
  onChange = (e) => {
    let { name ,value } = e.target
    this.setState({
      [name]: value
    })
  }
  render() {
    let { toggle } = this.props
    let { nameEnglish, nameArabic, descriptionEnglish, descriptionArabic, price, quantity } = this.state
    return (
      <>
      {
        toggle && (
          <Base width={1} height="" alignItems="center" justifyContent="center">
        <ModalBody>
          <ModalRow justifyContent="space-between" mb={2}>
            <Label>Name English</Label>
            <InputText name="nameEnglish" onChange={this.onChange} value={nameEnglish}></InputText>
          </ModalRow>
          <ModalRow justifyContent="space-between" mb={2}>
            <Label>Name Arabic</Label>
            <InputText name="nameArabic" onChange={this.onChange} value={nameArabic}></InputText>
          </ModalRow>
          <ModalRow justifyContent="space-between" mb={2}>
            <Label>Description English</Label>
            <InputText name="descriptionEnglish" onChange={this.onChange} value={descriptionEnglish}></InputText>
          </ModalRow>
          <ModalRow justifyContent="space-between" mb={2}>
            <Label>Description Arabic</Label>
            <InputText name="descriptionArabic" onChange={this.onChange} value={descriptionArabic}></InputText>
          </ModalRow>
          <ModalRow justifyContent="space-between" mb={2}>
            <Label>Quantity</Label>
            <InputText name="quantity" onChange={this.onChange} value={quantity}></InputText>
          </ModalRow>
          <ModalRow justifyContent="space-between" mb={2}>
            <Label>Price</Label>
            <InputText name="price" onChange={this.onChange} value={price}></InputText>
          </ModalRow>
          <ModalRow justifyContent="space-between" mt={3}>
            <Button onClick={this.closeModal}>Cancel</Button>
            <Button success onClick={this.submit} >Add</Button>
          </ModalRow>
        </ModalBody>
      </Base>
        )
      }
      </>
    );
  }
}

export default ProductModal;
