import styled from 'styled-components';

export const Category = styled.div`
  /* background: (({selected}) => selected || 'black'); */
  ${({selected}) => selected ? `
  background: black;
  color: white;
  ` : '' }
  &:hover {
  color: white;
  background: black;
  cursor: pointer;
  }
`