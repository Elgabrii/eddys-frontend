import React, { Component } from 'react';
import {
  Base,
  LoginContainer,
  Text,
  EddysLogo,
  LoginCredentials,
  FormGroupInput,
  TextInput,
  Button
} from './Login.style';
import { POST, baseURL } from '../../api/api';
import urls from '../../api/urls';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
export class Login extends Component {
  state = {
    email: '',
    password: '',
    error: '',
  }

  componentDidMount() {
    let authenticated = Cookies.get('auth')
    if (authenticated) {
      this.props.history.replace('/')
    }
  }

  setEmail = (event) => this.setState({email: event.target.value})
  setPassword = (event) => this.setState({password: event.target.value})
  submitCredintials = async () => {
    let { email, password } = this.state
    try {
      let res = await POST(`${baseURL}${urls.login}`, {
        email,
        password
      })
      Cookies.set('auth', res.data.token)
      this.props.history.replace('/')
    }
    catch(error) {
      this.setState({error: 'wrong credinitals!'})
    }
  }
  render() {
    let { email, password, error } = this.state
    return (
      <Base width={1} justifyContent="center" alignItems="center" height="100vh">
        <LoginContainer flexDirection="column" pt={4} alignItems="center">
          <EddysLogo>
            <Text fontSize="24px" fontWeight="800">
              Eddy's Dashboard
            </Text>
          </EddysLogo>
          <LoginCredentials width={1} px={5}  flexDirection="column">
            <FormGroupInput width={1} flexDirection="column">
              <Text fontSize="16px">Email:</Text>
              <TextInput value={email} onChange={this.setEmail} type="text" />
            </FormGroupInput>
            <FormGroupInput width={1} flexDirection="column">
              <Text fontSize="16px">Password:</Text>
              <TextInput value={password} onChange={this.setPassword} type="password" />
            </FormGroupInput>
            <FormGroupInput mt={3} width={1} flexDirection="column" alignItems="center">
              <Button onClick={this.submitCredintials} height="35px" fontSize="16px">Login</Button>
              <Text color="red">
                {error}
              </Text>
            </FormGroupInput>
          </LoginCredentials>
        </LoginContainer>
      </Base>
    );
  }
}

export default withRouter(Login);
