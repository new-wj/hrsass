import { constantRoutes, asyncRoutes } from '@/router'
export default {
  namespaced: true,
  state: {
    routes: constantRoutes
  },
  mutations: {
    addRoutes(state, otherRoutes) {
      state.routes = [...constantRoutes, ...otherRoutes]
    }
  },
  actions: {
    filterRoutes(context, menus) {
      const otherRoutes = asyncRoutes.filter(item =>
        menus.includes(item.children[0].name)
      )
      context.commit('addRoutes', otherRoutes)
      return otherRoutes
    }
  }
}
