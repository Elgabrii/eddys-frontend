import axios from 'axios';

export const GET = (url, config) => axios.get(url, config)
 
export const PUT = (url, data, config) => axios.put(url, data, config)

export const POST = (url, data, config) => axios.post(url, data, config)

export const PATCH = (url, data, config) => axios.patch(url, data, config)

export const DELETE = (url, config) => axios.delete(url, config)

export const headers = {
  'headers': { 
    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImNyZWF0ZWRBdCI6MTU4MTc3NTU2OTA1NywidXBkYXRlZEF0IjoxNTgxNzc1NTY5MDU3LCJpZCI6IjVlNDdmYWQxN2IzNWY5ZDcwNDdhNjQxZCIsImVtYWlsIjoibW9oYWJhbXIxQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJGFCVDNRMkIxOW9zVEs1RFdKa0JkbXU2WE9QRWxybWo1ZFhjanNXcTdTMENuTE5QdkZBUXR1Iiwicm9sZSI6ImFkbWluIiwidmVyaWZpZWQiOmZhbHNlfSwiaWF0IjoxNTgxNzkyMTIyLCJleHAiOjE1ODI2NTYxMjJ9.YSBhQjFzXSEWlw-SZu4eVvm5y-Ns4Xxe64qwe2jnutM' 
  } 
}
export const baseURL = 'https://eddys.herokuapp.com'