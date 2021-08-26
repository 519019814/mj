const getters = {
  user: state => state.user,
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  id: state => state.user.id,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  businessId: state => {
    state.user.businessId
  },
  username: state => state.user.username,
  password: state => state.user.passowrd,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  wcList: state => state.searchWc.wcList,
  currentWcInfo: state => state.searchWc.currentWcInfo,
  searchInput: state => state.searchWc.searchInput,
  searchHistory: state => state.searchWc.searchHistory,
  markerLabel: state => state.searchWc.markerLabel
}
export default getters
