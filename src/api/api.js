import axios from 'axios';
import Cookies from 'js-cookie';

// let auth = 
// export const headers = {
//   'headers': { 
//     'x-access-token': auth
//   } 
// }
export const baseURL = 'http://157.230.16.61:1337'
export const bareBaseURL = 'http://157.230.16.61'
let token = localStorage.getItem('auth');
export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'x-access-token': token,
    'Content-Type': 'application/json'
  }
})

export const GET = (url, config) => api.get(url, config)
 
export const PUT = (url, data, config) => api.put(url, data, config)

export const POST = (url, data, config) => api.post(url, data, config)

export const PATCH = (url, data, config) => api.patch(url, data, config)

export const DELETE = (url, config) => api.delete(url, config)

