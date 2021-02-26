import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: 'index',
      name: 'Employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工', icon: 'people' }
    }
  ]
}