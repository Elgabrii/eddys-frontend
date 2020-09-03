import React, { Component } from 'react';
import { Base, ModalBody, Label, ModalRow, InputText, Button } from './ProductModal.style';
import { POST, GET, baseURL, PATCH, PUT } from '../../api/api';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import './productModal.scss';

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

const productTypes = [
  {
    id: 1,
    type: 'normal'
  },
  {
    id: 2,
    type: 'catering'
  }
]

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
      images: [],
      availability: false,
      howToPrepare: '',
      storingMethod: '',
      ingredientsEnglish: '',
      ingredientsArabic: '',
      type: '',
      category: null,
      quantity: 0,
      submitting: false,
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
      howToPrepare,
      storingMethod,
      ingredientsEnglish,
      ingredientsArabic,
      edit,
      images,
      type
    } = this.props
    if(!edit) return
    if (
      nameEnglish !== prevProps.nameEnglish 
      || 
      type !== prevProps.type
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
      ||
      howToPrepare !== prevProps.howToPrepare
      ||
      storingMethod !== prevProps.storingMethod
      ||
      ingredientsEnglish !== prevProps.ingredientsEnglish
      ||
      ingredientsArabic !== prevProps.ingredientsArabic
      ||
      images !== prevProps.images
      )
      // howToPrepare: '',
      // storingMethod: '',
      // ingredientsEnglish: '',
      // ingredientsArabic: '',
    this.setState({
      nameEnglish,
      type,
      nameArabic,
      descriptionEnglish,
      descriptionArabic,
      price,
      availability,
      howToPrepare,
      storingMethod,
      ingredientsEnglish,
      ingredientsArabic,
      category: category&&category.id,
      images: images.map(image => ({...image, deleted: false}))

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
      howToPrepare: '',
      storingMethod: '',
      ingredientsEnglish: '',
      ingredientsArabic: '',
      availability: false,
      type: '',
    })
    this.props.stopEdit()
    this.props.closeModal()
  }
  uploadImages = async() => {
    if(this.state.submitting) return
    this.setState({submitting: true})
    let { pictures } = this.state
    const formData = new FormData()
    if(pictures) {
      for (let index = 0; index < pictures.length; index++) {
        formData.append('files', pictures[index])
      }
    }
    try {
      let res = await POST(`${baseURL}${urls.upload}?limit=${this.state.pictures.length}`, formData, {
        'content-type': 'multipart/form-data'
      })
      let images = res.data.uploadedImages.map(image => image.id)
      this.setState({pictures: images}, this.submit)
    }
    catch(err) {
      throw err
    }
  }
  submit = async () => {
    try {

      let imageIds = this.state.images&&this.state.images.filter(
        image => !image.deleted
      ).map(image=>image.id)
      if(!this.props.edit) {
        await POST(`${baseURL}${urls.products}`, {
          ...this.state,
          images: [...this.state.pictures, ...imageIds],
          pictures: []
        })
        this.setState({submitting: false})
        this.props.loadProducts()
        this.closeModal()
        // await GET(`${urls.base}${urls.products}`, headers)
      } else {
        await PUT(`${baseURL}${urls.products}/${this.props.id}`, {
          ...this.state,
          images: [...this.state.pictures, ...imageIds],
          pictures: []
        })
        this.setState({submitting: false})
        this.props.loadProducts()
        this.closeModal()
      }
    }
    catch(err) {
      this.setState({submitting: false})
      throw err;
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
  removeImage = (image) => {
    let { images } = this.state
    let newImages = [...images]
    let imageIndex = newImages.findIndex(currentImage => currentImage.id === image.id)
    newImages[imageIndex] = {
      ...newImages[imageIndex],
      deleted: !newImages[imageIndex].deleted,
    }
    this.setState({images: newImages})
  }
  render() {
    let { toggle, categories, product } = this.props
    let { nameEnglish, images, nameArabic, descriptionEnglish, descriptionArabic, price, availability, category, howToPrepare, storingMethod, ingredientsEnglish, ingredientsArabic, type } = this.state
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
            <TextField label="How to Prepare" name="howToPrepare" onChange={this.onChange} value={howToPrepare}></TextField>
            <TextField label="Storing Method" name="storingMethod" onChange={this.onChange} value={storingMethod}></TextField>
            <TextField label="Ingredients English" name="ingredientsEnglish" onChange={this.onChange} value={ingredientsEnglish}></TextField>
            <TextField label="Ingredients Arabic" name="ingredientsArabic" onChange={this.onChange} value={ingredientsArabic}></TextField>
          <ModalRow justifyContent="space-between" mb={2}>
            <TextField label="Price" name="price" onChange={this.onChange} value={price}></TextField>
          </ModalRow>
          <ModalRow justifyContent="space-between" mb={2} mt={3}>
            <p>Current Images assigned to product: {this.props.images&&this.props.images.length}</p>
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
          <TextField
            id="standard-select-currency"
            select
            name="type"
            label=""
            value={type}
            onChange={this.onChange}
            helperText="Please select a product type"
          >
            {productTypes&&productTypes.map((option) => (
              <MenuItem key={option.id} value={option.type}>
                {option.type}
              </MenuItem>
            ))}
          </TextField>
          </ModalRow>
          <ModalRow>
            <GridList cellHeight="130" cols={3}>
              {
                images.map(image => 
                  <GridListTile className={`pointer ${image.deleted? 'opacity' : 'no-opacity'}`} onClick={() => this.removeImage(image)} key={image.id} cols={1}>
                    <img src={`https://backend.eddys-kitchen.com/${image.link}`} alt="" />
                  </GridListTile>
                )
              }
              
            </GridList>
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
