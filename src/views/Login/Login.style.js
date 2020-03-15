import styled from 'styled-components';
import { Flex } from '@rebass/grid';

export const Base = styled(Flex)``

export const LoginContainer = styled(Flex)`
  width: 30%;
  border: 1px solid black;
  border-radius: 3px;
  height: 400px;
`
export const EddysLogo = styled.div`

`
export const Text = styled.p`
  font-size: ${({fontSize}) => fontSize || '18px'};
  font-weight: ${({fontWeight}) => fontWeight || '400'};
  color: ${({color}) => color || '400'};
`
export const LoginCredentials = styled(Flex)``

export const FormGroupInput = styled(Flex)``

export const TextInput = styled.input`
  height: 30px;
  border-radius: 3px;
  border: 1px solid grey;
  outline: none;
  padding-left: 10px;
  font-size: 16px;
  /* border-style: none; */
`
export const Button = styled.button`
  width: ${({width}) => width || '100%' };
  height: ${({height}) => height || '30px' };
  background: ${({backgroundColor}) => backgroundColor || 'black'};
  color: ${({color}) => color || 'white'};
  font-size: ${({fontSize}) => fontSize || '18px'};
  font-weight: ${({fontWeight}) => fontWeight || 'bold'};
  border-radius: 3px;
  outline: none;
  cursor: pointer;
`