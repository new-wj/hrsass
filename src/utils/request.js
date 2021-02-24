import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  function(config) {
    const token = store.getters.token
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const { data, message, success } = response.data
    if (success) {
      return data
    } else {
      Message.error(message)
      return Promise.reject(message)
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
