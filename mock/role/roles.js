const { deepClone } = require('../utils')
const { asyncRoutes, constantRoutes } = require('./routes.js')
const routes = deepClone([...constantRoutes, ...asyncRoutes])

const roles = [
  {
    key: 'admin',
    name: '超级管理员',
    description: '超级管理员，可以查看所有页面',
    routes: routes
  },
  {
    key: 'editor',
    name: '编辑',
    description: '可以查看部分页面',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  },
  {
    key: 'area',
    name: '区域',
    description: '可以进行区域管理',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  },
  {
    key: 'visitor',
    name: '厕所所长',
    description: '厕所所长，可以管理',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
]

module.exports = {
  roles,
  routes
}
