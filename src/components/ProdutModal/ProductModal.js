import React, { Component } from 'react';
import { Base, ModalBody, Label, ModalRow, InputText, Button } from './ProductModal.style';
import { POST, GET, headers, baseURL } from '../../api/api';
import urls from '../../api/urls';
import ImageUploader from "react-images-upload";
export class ProductModal extends Component {
  state = {
    nameEnglish: '',
    nameArabic: '',
    descriptionEnglish: '',
    descriptionArabic: '',
    price: '',
    quantity: '',
    pictures: [],
  }
  closeModal = () => {
    this.props.closeModal()
  }
  uploadImages = async() => {
    let { pictures } = this.state
    const formData = new FormData()
    if(pictures) {
      for (let index = 0; index < pictures.length; index++) {
        formData.append('files', pictures[index])
      }
    }
    try {
      let res = await POST(`${baseURL}${urls.upload}?limit=${this.state.pictures.length}`, formData, {
        ...headers,
        'content-type': 'multipart/form-data'
      })
      let images = res.data.uploadedImages.map(image => image.id)
      this.setState({pictures: images}, this.submit)
    }
    catch(err) {
      throw err
    }
  }
  // handleFileUpload = async (e) => {
  //   this.setState({uploading: true})
  //   let files = e.target.files
  //   const formData = new FormData()
  //   formData.append('file', files[0])
  //   const config = {
  //     headers: {
  //         'content-type': 'multipart/form-data'
  //     }
  //   }
  //   try {
  //     await PUT(`${urls.base.inventoryMicroservice}${urls.endpoints.ProductsBulk}`, formData, config);
  //     alert('File uploaded successfully!')
  //     this.fileInput.value=""
  //     this.setState({uploading: false})
  //   }
  //   catch(err) {
  //     console.log(err);
  //   }
  // }
  submit = async () => {
    try {
      await POST(`${baseURL}${urls.products}`, {
        ...this.state,
        images: this.state.pictures,
        pictures: []
      }, headers)
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
  onDrop = (pictureFiles, pictureDataURLs) => {
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles)
    });
  }
  render() {
    let { toggle, categories } = this.props
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
            <Label>Category</Label>
            <select name="category" onChange={this.onChange}>
              {categories&&categories.map(category => (
                <option value={category.id}> {category.name} </option>
              ))}
            </select>
          </ModalRow>
          <ModalRow justifyContent="space-between" mb={2}>
            <Label>Quantity</Label>
            <InputText name="quantity" onChange={this.onChange} value={quantity}></InputText>
          </ModalRow>
          <ModalRow justifyContent="space-between" mb={2}>
            <Label>Price</Label>
            <InputText name="price" onChange={this.onChange} value={price}></InputText>
          </ModalRow>
          <ModalRow justifyContent="space-between" mb={2}>
            <ImageUploader
              withIcon={true}
              buttonText="Choose images"
              onChange={this.onDrop}
              imgExtension={[".jpg", ".gif", ".png", ".gif"]}
              maxFileSize={5242880}
            />
          </ModalRow>
          <ModalRow justifyContent="space-between" mt={3}>
            <Button onClick={this.closeModal}>Cancel</Button>
            <Button success onClick={this.uploadImages} >Add</Button>
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
