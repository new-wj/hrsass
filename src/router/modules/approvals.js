import Layout from '@/layout'
export default {
  path: '/approvals',
  component: Layout,
  children: [
    {
      path: 'index',
      name: 'Approvals',
      component: () => import('@/views/approvals'),
      meta: { title: '审批', icon: 'tree-table' }
    }
  ]
}
