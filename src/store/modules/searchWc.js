import { getWcList, getWcInfo } from '@/api/wcmontior'

const state = {
  wcList: [],
  currentWcInfo: {},
  searchInput: '',
  searchHistory: [],
  markerLabel: null
}

const mutations = {
  SET_WCLIST(state, wcList) {
    state.wcList = wcList
  },
  SET_CURRENTWCINFO(state, currentWcInfo) {
    state.currentWcInfo = currentWcInfo
  },
  SET_SEARCHINPUT(state, searchInput) {
    state.searchInput = searchInput
  },
  set_searchHistory(state, text) {
    const hisArr = state.searchHistory
    // 如果已有相同历史记录,取出该历史纪录将它提升到首位，否则中unshift
    const index = hisArr.findIndex(item => text === item.value)
    if (index !== -1) {
      hisArr.unshift(hisArr.splice(index, 1)[0])
    } else hisArr.unshift({ value: text, key: new Date().getTime() })
  },
  del_searchHistory(state, index) {
    state.searchHistory.splice(index, 1)
  },
  set_markerLabel(state, id) {
    state.markerLabel = id
  }
}

const actions = {
  getWcList({ state, commit }, { query, router }) {
    return new Promise((resolve, reject) => {
      getWcList(query).then(res => {
        const list = handleList(res.data.list, state, router)
        // 中心点坐标为搜索结果的第一个
        if (list.length) commit('SET_CURRENTWCINFO', list[0])
        commit('SET_WCLIST', list)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })

    function handleList(list, state, router) {
      return list.map(item => {
        item.icon = 'https://minio.zjdmwh.cn/csdlny/ceshi/wc.png'
        item.animation = 'AMAP_ANIMATION_DROP'
        item.clickable = true
        item.label = {
          content: item.title,
          offset: [-17, -30]
        }
        item.events = {
          click(e) {
            const vid = e.target.Ce.vid
            const currentMarker = state.wcList.find(value => value.id === vid)
            router.replace({
              path: `/wcmap/page/${vid}`
            })
            // 当前marker
            commit('SET_CURRENTWCINFO', currentMarker)
            // 当前label
            commit('set_markerLabel', currentMarker.id)
          }
        }
        return item
      })
    }
  },
  getWcInfo({ commit }, query) {
    return new Promise((resolve, reject) => {
      getWcInfo(query).then(res => {
        console.log(res)
        commit('SET_CURRENTWCINFO', res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
