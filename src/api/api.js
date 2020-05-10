import axios from 'axios';
import Cookies from 'js-cookie';

let auth = Cookies.get('auth')
export const headers = {
  'headers': { 
    'x-access-token': auth
  } 
}

export const GET = (url, config) => axios.get(url, {...config, ...headers})
 
export const PUT = (url, data, config) => axios.put(url, data, {...config, ...headers})

export const POST = (url, data, config) => axios.post(url, data, config)

export const PATCH = (url, data, config) => axios.patch(url, data, config)

export const DELETE = (url, config) => axios.delete(url, config)

export const baseURL = 'http://157.230.16.61:1337'

export const bareBaseURL = 'http://157.230.16.61'