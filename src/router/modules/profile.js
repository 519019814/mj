import Layout from '@/layout'
const profileRouter = {
  path: '/profile',
  component: Layout,
  redirect: '/table/complex-table1',
  name: '个人中心',
  meta: {
    title: '个人中心',
    icon: 'table'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/profile/index'),
      name: 'ProfileIndex',
      meta: { title: '我的信息' }
    }, {
      path: 'changepwd',
      component: () => import('@/views/feedback/index'),
      name: 'Changepwd',
      meta: { title: '修改密码' }
    }
  ]
}

export default profileRouter
