import Vue from 'vue'
import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api'
})
instance.interceptors.request.use(request => {
  request.headers['Access-Control-Allow-Origin'] = '*'
  const token = localStorage.getItem('token')
  if (token) {
    request.headers['x-auth-token'] = token
  }

  return request
})

instance.interceptors.response.use(
  response => {
    if (localStorage.getItem('token') !== null && response.status === 401) {
      localStorage.clear()
      window.location.reload()
    }

    return response
  },
  error => {
    if (error.response.status === 401) {
      localStorage.clear()
      window.location.reload()
    }
    return error
  }
)

Vue.prototype.$axios = instance
