import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import statistics from './modules/statistics'
import feedBackRouter from './modules/feedBack'
/**
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 */

/**
 * constantRoutes
 * 基础路由，所有角色可访问
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '公厕指标看板', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * 根据角色权限动态加载的路由
 */
export const asyncRoutes = [

  {
    path: '/wcmap',
    component: Layout,
    redirect: '/wcmap/page/search',
    name: 'WcAmap',
    meta: {
      title: '公厕一览',
      icon: 'el-icon-s-promotion',
      roles: ['admin']
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/wc-map/index'),
        name: 'WcMap',
        hidden: true,
        redirect: '/wcmap/page/search?wd=',
        activeMenu: '/wcmap',
        children: [
          {
            path: 'searchHistory',
            component: () => import('@/views/wc-map/search-history.vue'),
            name: 'SearchHistory',
            hidden: true,
            meta: { title: '看板', icon: 'promotion', activeMenu: '/wcmap' }
          },
          {
            path: 'search',
            component: () => import('@/views/wc-map/searchres.vue'),
            name: 'SearchRes',
            hidden: true,
            meta: { title: '公厕搜索', icon: 'edit', activeMenu: '/wcmap' }
          },
          {
            path: ':place',
            component: () => import('@/views/wc-map/search-detail.vue'),
            name: 'Place',
            activeMenu: '/wcmap',
            hidden: true,
            meta: { title: '公厕详情', icon: 'edit', activeMenu: '/wcmap' }
          }
        ]
      }
    ]
  }, {
    path: '/wcmontior',
    component: Layout,
    redirect: '/WcMontior/page',
    name: 'Wc',
    meta: {
      title: '实时监控',
      icon: 'el-icon-s-opportunity',
      roles: ['admin']
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/wc-monitor/index'),
        name: 'WcMontior',
        meta: { title: '实时监控', icon: 'edit' }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/wc-monitor/wc-detail'),
        name: 'WcDetail',
        hidden: true,
        meta: { title: '详情', icon: 'edit', activeMenu: '/wcmontior/page', noCache: true }
      }
    ]
  },
  {
    path: '/wcHeatmap',
    component: Layout,
    redirect: '/wcHeatmap/heatmap',
    name: 'WcHeatmap',
    meta: {
      title: '热力图',
      icon: 'el-icon-s-data',
      roles: ['admin']
    },
    children: [
      {
        path: 'heatmap',
        component: () => import('@/views/wc-heatmap/index'),
        name: 'Heatmap',
        meta: { title: '热力图', icon: 'data' }
      }
    ]
  },
  statistics,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: '资讯管理',
      icon: 'el-icon-s-help',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: '资讯', icon: 'list' }
      },
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: '创建资讯', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: '编辑资讯', noCache: true, activeMenu: '/example/list' },
        hidden: true
      }
    ]
  },
  tableRouter,
  {
    path: '/company',
    component: Layout,
    redirect: '/company/list',
    name: 'Company',
    meta: {
      title: '单位管理',
      icon: 'table'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/company/create'),
        name: 'CreateCompany',
        meta: { title: '创建单位' }
      },
      {
        path: 'list',
        component: () => import('@/views/company/list'),
        name: 'Companys',
        meta: { title: '单位列表' }
      },
      // {
      //   path: 'edit',
      //   component: () => import('@/views/company/list'),
      //   name: 'Companys',
      //   meta: { title: '考核情况' }
      // },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/company/edit'),
        name: 'EditCompany',
        meta: { title: '编辑', noCache: true, activeMenu: '/company/list' },
        hidden: true
      }
    ]
  },
  // chartsRouter,
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'User',
        component: () => import('@/views/permission/user'),
        name: 'User',
        meta: {
          title: '账号管理' // or you can only set roles in sub nav
        }
      },
      {
        path: 'departmentManagement',
        component: () => import('@/views/permission/departmentManagement'),
        name: 'DepartmentManagement',
        meta: {
          title: '部门管理'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '角色管理'
        }
      }
    ]
  },
  {
    path: '/usermanage',
    component: Layout,
    redirect: '/user-manage/user',
    name: 'UserManage',
    meta: {
      title: '用户管理',
      icon: 'table'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user-manage/user'),
        name: 'UserList',
        meta: { title: '用户列表' }
      },
      {
        path: 'moments',
        component: () => import('@/views/user-manage/moments'),
        name: 'Moments',
        meta: { title: '随手拍' }
      },
      {
        path: 'comment',
        component: () => import('@/views/user-manage/comment'),
        name: 'Comment',
        meta: { title: '评论管理' }
      }
    ]
  },
  feedBackRouter,
  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: '标签页实例', icon: 'tab' }
  //     }
  //   ]
  // }
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
