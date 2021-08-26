/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: '公厕管理',
    icon: 'table'
  },
  children: [
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inline-edit-table'),
      name: 'inlineEditTable',
      meta: { title: '公厕列表' }
    },
    {
      path: 'assessment',
      component: () => import('@/views/table/assessment'),
      name: 'Assessment',
      meta: { title: '考核打分' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table'),
      name: 'ComplexTable',
      meta: { title: '数据总览' }
    }
  ]
}
export default tableRouter
