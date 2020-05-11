import React, { Component } from 'react';
import { Base, ModalBody, Label, ModalRow, InputText, Button } from './ProductModal.style';
import { POST, GET, headers, baseURL, PATCH, PUT } from '../../api/api';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';


import urls from '../../api/urls';
import ImageUploader from "react-images-upload";
let classes = {
  root: {
    '& > *': {
      margin: '10px',
      width: '500px',
    }
  }
}

export class ProductModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nameEnglish: '',
      nameArabic: '',
      descriptionEnglish: '',
      descriptionArabic: '',
      price: '',
      pictures: [],
      availability: false,
      category: null,
      quantity: 0,
    }
  }
  componentDidUpdate(prevProps) {
    let {
      nameEnglish,
      nameArabic,
      descriptionEnglish,
      descriptionArabic,
      price,
      availability,
      category,
      edit
    } = this.props
    if(!edit) return
    if (
      nameEnglish !== prevProps.nameEnglish 
      || 
      nameArabic !== prevProps.nameArabic
      ||
      descriptionEnglish !== prevProps.descriptionEnglish
      ||
      descriptionArabic !== prevProps.descriptionArabic
      ||
      price !== prevProps.price
      ||
      category !== prevProps.category
      ||
      availability !== prevProps.availability
      ||
      edit !== prevProps.edit
      )
    this.setState({
      nameEnglish,
      nameArabic,
      descriptionEnglish,
      descriptionArabic,
      price,
      availability,
      category: category&&category.id
    })
  }
  // componentDidMount() {
  //   if(this.props.nameEnglish) {
  //     let { nameEnglish, nameArabic, descriptionEnglish, descriptionArabic, availability, price } = this.props
  //     this.setState({
  //       nameEnglish,
  //       nameArabic,
  //       descriptionEnglish,
  //       descriptionArabic,
  //       availability,
  //       price
  //     })
  //   }
  // }
  closeModal = () => {
    this.setState({
      nameEnglish: '',
      nameArabic: '',
      quantity: 0,
      category: null,
      price: '',
      descriptionEnglish: '',
      descriptionArabic: '',
      availability: false
    })
    this.props.stopEdit()
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
      if(!this.props.edit) {

        await POST(`${baseURL}${urls.products}`, {
          ...this.state,
          images: this.state.pictures,
          pictures: []
        }, headers)
        this.props.loadProducts()
        this.closeModal()
        // await GET(`${urls.base}${urls.products}`, headers)
      } else {
        await PUT(`${baseURL}${urls.products}/${this.props.id}`, {
          ...this.state,
          images: this.state.pictures,
          pictures: []
        }, headers)
        this.props.loadProducts()
        this.closeModal()
      }
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
  handleCheckbox = (e) => {
    this.setState({ availability: e.target.checked })
  }
  onDrop = (pictureFiles, pictureDataURLs) => {
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles)
    });
  }
  render() {
    let { toggle, categories, product } = this.props
    let { nameEnglish, nameArabic, descriptionEnglish, descriptionArabic, price, availability, category } = this.state
    return (
      <>
      {
        toggle && (
          <Base width={1} height="" alignItems="center" justifyContent="center">
        <ModalBody>
          <ModalRow justifyContent="space-between" mb={2}>
            <TextField label="Name English" name="nameEnglish" onChange={this.onChange} value={nameEnglish} />
            <TextField name="nameArabic" onChange={this.onChange} value={nameArabic} label="Name Arabic" />
          </ModalRow>
            <TextField label="Description English" name="descriptionEnglish" onChange={this.onChange} value={descriptionEnglish}></TextField>
            <TextField label="Description Arabic" name="descriptionArabic" onChange={this.onChange} value={descriptionArabic}></TextField>
          <ModalRow justifyContent="space-between" mb={2}>
            <TextField label="Price" name="price" onChange={this.onChange} value={price}></TextField>
          </ModalRow>
          <ModalRow justifyContent="space-between" mb={2} mt={3}>
            {/* <Label>Category</Label>
            <select name="category" onChange={this.onChange}>
              {categories&&categories.map(category => (
                <option value={category.id} selected={category.id == this.props.category}> {category.name} </option>
              ))}
            </select> */}
          <TextField
            id="standard-select-currency"
            select
            name="category"
            label=""
            value={category}
            onChange={this.onChange}
            helperText="Please select a product category"
          >
            {categories&&categories.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          </ModalRow>
          <ModalRow justifyContent="space-between" mb={2}>
            {/* <InputText name="quantity" onChange={this.onChange} value={quantity}></InputText> */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={availability}
                  onChange={this.handleCheckbox}
                  name="availability"
                  color="primary"
                />
              }
              label="Available"
            />
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
