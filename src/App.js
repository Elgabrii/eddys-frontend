import React from 'react'
// import logo from './logo.svg';
import './App.css'
// import name from 'module';
import { BrowserRouter as Router, Redirect } from 'react-router-dom'
import Routes from './routes'
import Cookies from 'js-cookie'
import { ThemeProvider } from 'styled-components'
import MainContainer from './components/MainContainer'

const theme = {
  colors: {
    primary: '#0070CD',
    default: '#363636',
    yellow: '#f4c324',
    red: '#ff2865',
    turqoise: '#00bbd3',
    peachyPink: '#ff9391',
    lavenderBlue: '#7881fc',
    green: '#4bba5b',
    lightGreen: '#7DC234',
    black: '#2f2f2f',
    grey: '#7e7e7e',
    mediumGrey: '#E4E4E4',
    lightGrey: '#898989',
    lightBlack: '#474747',
    white: '#ffffff',
    darkgrey: '#646464',
    veryVeryLightGrey: '#f6f6f6',
    veryLightGrey: '#e4e4e4',
    lightBlue: '#e5f0fa',
    mediumBlue: '#0070cd4d',
    veryLightBlue: '#ccdee8',
    paige: '#f6eac9',
  },
  typography: {
    h1: '31px',
    h2: '24px',
    h3: '20px',
    large: '18px',
    normal: '16px',
    small: '14px',
    verySmall: '12px',
  },
}

function App() {
  let loggedIn = localStorage.getItem('auth')
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
        <MainContainer />
          {!loggedIn ? <Redirect to="/login"/> : ''}
        </Router>
      </ThemeProvider>
    </div>
  )
}

export default App
