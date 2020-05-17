import styled from 'styled-components'
import { Flex } from '@rebass/grid'
import { Link } from 'react-router-dom'

export const Base = styled(Flex)`
  background: ${props => (props.isLoginPage ? ' #fff;' : '#f4f7fc')};
`
export const SidebarContainer = styled(Flex)`
  background: ${props => props.theme.colors.primary};
  padding-top: 30px;
  min-height: 96vh;
`
export const SidebarItem = styled(Flex)`
  ${({ selected }) => (selected ? 'border-left: 3px solid white' : '')};
  background: ${({ selected, theme }) =>
    selected ? '#005296' : theme.colors.primary};
  font-size: 16px;
  font-weight: normal;
  color: white;
  cursor: pointer;
  height: 46px;
  img {
    margin: 0 10px;
  }
`
export const StyledLink = styled(Link)`
  text-decoration: none;
`
