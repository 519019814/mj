import Layout from '@/layout'
const feedBackRouter = {
  path: '/feedback',
  component: Layout,
  redirect: '/feedback/list',
  name: 'FeedBack',
  meta: {
    title: '反馈管理',
    icon: 'table'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/feedback/index'),
      name: 'Feedback',
      meta: { title: '意见反馈' }
    }
  ]
}

export default feedBackRouter
