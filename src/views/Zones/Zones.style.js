import styled from 'styled-components';

export const Base = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
export const upperSection = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Zone = styled.div`
  /* height: 60px; */
  display: flex;
  justify-content: space-between;
  border-radius: 3px;
  padding: 10px;
  &:hover {
  background: grey;
    
    transition: background 2s;

  }
  align-items: center;
  cursor: pointer;
`
export const Zones = styled.div`
  padding-top: 20px;
  width: 50%;
`