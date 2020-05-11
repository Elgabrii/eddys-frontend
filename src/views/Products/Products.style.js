import styled from 'styled-components';
import { Flex } from '@rebass/grid';

export const Headings = styled(Flex)`
`
export const Heading = styled(Flex)`
  font-size: ${({theme}) => theme.typography.h2}
`
export const PaginationContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: flex-end;
  justify-content: center;
`
export const Base = styled(Flex)``

export const ProductsContainer = styled(Flex)`

`
export const ProductName = styled(Flex)`
  font-size: ${({theme}) => theme.typography.h3};
`
export const ImageContainer = styled.div`
  max-width: 130px;
  img {
    width: 100%;
  }
`
export const Product = styled(Flex)``

export const ProductPrice = styled(Flex)`
  font-size: ${({theme}) => theme.typography.normal};
`