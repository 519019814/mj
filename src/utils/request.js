import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true,
  timeout: 5000 // 超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 获取token
    if (store.getters.token) {
      config.headers['authorization'] = getToken()
    }
    return config
  },
  error => {
    // 错误捕获
    console.error(error)
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  response => {
    const res = response.data
    // 将响应头加入到响应data中
    res.headers = response.headers
    // 后端正常代码 code = "0"
    res.code = Number(res.code)
    if (res.code !== 0) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // token失效，登录过期，在其他地方登录，均清除本地token后跳转至登录页
      if (res.code === 5001 || res.code === 5002 || res.code === 5004) {
        // to re-login
        MessageBox.confirm('您已注销，点击取消停留在此页面，或者重新登录', '确认退出？', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应拦截器捕获到error: ', error.response)
    Message({
      message: error.response.data.message || error.response.data.error || error.response.data,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
