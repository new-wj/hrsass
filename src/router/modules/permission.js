import Layout from '@/layout'
export default {
  path: '/permission',
  component: Layout,
  children: [
    {
      path: 'index',
      name: 'Permission',
      component: () => import('@/views/permission'),
      meta: { title: '权限管理', icon: 'lock' }
    }
  ]
}
