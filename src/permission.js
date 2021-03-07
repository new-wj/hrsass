import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const token = store.getters.token
  if (token) {
    if (!store.getters.name) {
      const { roles } = await store.dispatch('user/getUserInfo')
      const otherRoutes = await store.dispatch(
        'permission/filterRoutes',
        roles.menus
      )
      router.addRoutes([
        ...otherRoutes,
        { path: '*', redirect: '/404', hidden: true }
      ])
      next({ ...to, replace: true })
      return
    }
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})
router.afterEach((to, from) => {
  NProgress.done()
})
