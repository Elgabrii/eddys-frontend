import styled from 'styled-components';
import { Flex } from '@rebass/grid';

export const Base = styled(Flex)`
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  color: black;
  background:#000000b8;
  /* max-height: 500px; */
`
// background:#000000b8;
// position:fixed;
// z-index:999;
// top:0;
// bottom:0;
// right:0;
// left:0;
// align-items:center;
// justify-content:center;
// display: ${({ toggle }) => toggle ? 'flex' : 'none' };
export const ModalBody = styled.div`
  width: 300px;
  /* height: 300px; */
  background: white;
  padding: 30px;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  max-height: 500px;
  border-radius: 3px;
  overflow-y: scroll;
  width: 50%;
  // align-items: center;

`
export const ModalRow = styled(Flex)`
// color: white;
  
`
export const Label = styled.label`
  // margin-right: 25px;
  height: 30px;
`
export const InputText = styled.input`
  border: 1px solid black;
  border-radius: 3px;
  outline: none;
`
export const Button = styled.button`
  height: 30px;
  width: 100px;
  background: ${({ success }) => success ? '#5CCC6E' : '#DE4D51' }
  border: none;
  border-radius: 3px;
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
`

// {
// 	"nameEnglish": "chicken kids meal",
// 	"nameArabic": "وجبة اطفال",
// 	"descriptionEnglish": "a meal for kids",
// 	"descriptionArabic": "وجبة شهية للآطفال",
// 	"price": 100,
// 	"quantity": 60,
// 	"images": [
// 		"image1",
// 		"image2",
// 		"image3"
// 	]
// }