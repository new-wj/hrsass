import Layout from '@/layout'
export default {
  path: '/setting',
  component: Layout,
  children: [
    {
      path: 'index',
      name: 'Setting',
      component: () => import('@/views/setting'),
      meta: { title: '公司设置', icon: 'setting' }
    }
  ]
}