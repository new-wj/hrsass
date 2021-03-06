const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  avatar: state => state.user.userInfo.photo,
  id: state => state.user.userInfo.userId,
  routes: state => state.permission.routes
}
export default getters
