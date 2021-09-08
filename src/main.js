import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
// import './styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'
import { mockXHR } from '../mock'
import './icons'
import './permission'
import './utils/error-log'

import * as filters from './filters'
import VueAMap from 'vue-amap'
import GeminiScrollbar from 'vue-gemini-scrollbar'

Vue.use(GeminiScrollbar)
Vue.use(VueAMap)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})

// 生产环境去除mockJS
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

VueAMap.initAMapApiLoader({
  key: '7c38d01a2af1ca67bb7099d50c5b30aa',
  plugin: ['AMap.MarkerClusterer', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
  v: '1.4.4',
  uiVersion: '1.0'
})
// 注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
