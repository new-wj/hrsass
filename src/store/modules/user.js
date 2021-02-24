import { getUserInfo, login, getUserDetail } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  setUserInfo(state, data) {
    state.userInfo = data
  },
  exit(state) {
    state.token = null
    state.userInfo = {}
    removeToken()
  }
}
const actions = {
  async getToken({ commit }, data) {
    const res = await login(data)
    commit('setToken', res)
  },
  async getUserInfo({ commit }) {
    console.log(2222)
    const res = await getUserInfo()
    const data = await getUserDetail(res.userId)
    const photo = data.staffPhoto
    commit('setUserInfo', {
      ...res,
      photo
    })
  },
  async exit({ commit }) {
    commit('exit')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
