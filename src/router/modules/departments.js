import Layout from '@/layout'
export default {
  path: '/departments',
  component: Layout,
  children: [
    {
      path: 'index',
      name: 'Departments',
      component: () => import('@/views/departments'),
      meta: { title: '组织架构', icon: 'tree' }
    }
  ]
}
