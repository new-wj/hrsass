import Layout from '@/layout'
export default {
  path: '/salarys',
  component: Layout,
  children: [
    {
      path: 'index',
      name: 'Salarys',
      component: () => import('@/views/salarys'),
      meta: { title: '工资', icon: 'money' }
    }
  ]
}
