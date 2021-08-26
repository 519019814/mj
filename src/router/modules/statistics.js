import Layout from '@/layout'
const statisticsRouter = {
  path: '/statistical',
  component: Layout,
  redirect: '/statistical/people',
  name: 'statistical',
  meta: {
    title: '数据统计',
    icon: 'el-icon-s-help',
    roles: ['admin']
  },
  children: [
    {
      path: 'people',
      component: () => import('@/views/statistical-table/people'),
      name: 'People',
      meta: { title: '人流量统计', icon: 'list' }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/example/edit'),
      name: 'EditArticle4',
      meta: { title: '编辑', noCache: true, activeMenu: '/example/list' },
      hidden: true
    },
    {
      path: 'temperature',
      component: () => import('@/views/statistical-table/temperature'),
      name: 'Temperature',
      meta: { title: '温感统计', icon: 'list' }
    },
    {
      path: 'smell',
      component: () => import('@/views/statistical-table/smell'),
      name: 'Smell',
      meta: { title: '臭气统计', icon: 'list' }
    },
    {
      path: 'nkwh',
      component: () => import('@/views/statistical-table/nkwh'),
      name: 'Nkwh',
      meta: { title: '用电统计', icon: 'list' }
    },
    {
      path: 'water',
      component: () => import('@/views/statistical-table/water'),
      name: 'Water',
      meta: { title: '用水统计', icon: 'list' }
    },
    {
      path: 'kengwei',
      component: () => import('@/views/statistical-table/kengwei'),
      name: 'Kengwei',
      meta: { title: '剩余坑位统计', icon: 'list' }
    }
  ]
}
export default statisticsRouter
