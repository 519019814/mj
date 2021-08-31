<template>
  <div class="search-listContent">
    <div class="header">
      <div style="text-align: right; position: absolute; left: 0; top: 5px">
        <el-link type="primary" @click="onBackHistory">返回</el-link>
      </div>
      <el-button size="mini">星级</el-button>
      <el-button size="mini">状态</el-button>
      <el-button size="mini">其他</el-button>
    </div>
    <transition name="slide-fade">
      <div v-if="wcList.length" key="div1">
        <div
          v-for="(item, index) in wcList"
          :key="item.id"
          @click="handleSearchItem(item)"
          @mouseenter="handleCurrentLabel(item)"
        >
          <div class="listContent">
            <div class="title">
              <div>
                {{ index + 1 }} <span>{{ item.title }}</span>
              </div>
            </div>
            <div class="listContent-item">
              <div class="item-info">
                <div>星级：{{ item.importance }}级</div>
                <div>地址：{{ item.address }}</div>
                <div>建立时间：{{ item.display_time }}</div>
              </div>
              <div class="img">
                <img :src="item.urls" alt="" width="101" height="68">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else key="div2">没有找到有关搜索结果 <br><br></div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'SearchRes',
  computed: {
    wcList() {
      return this.$store.state.searchWc.wcList
    }
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    console.log('当前路由改变')
    setTimeout(() => {
      this.update()
    }, 0)
    next()
  },
  mounted() {
    this.update()
  },
  methods: {
    handleSearchItem(item) {
      this.$store.commit('searchWc/SET_CURRENTWCINFO', item)
      this.$router.push({
        path: `/wcmap/page/${item.id}`
      })
    },
    handleCurrentLabel(item) {
      this.$store.commit('searchWc/set_markerLabel', item.id)
    },
    onBackHistory() {
      this.$store.commit('searchWc/SET_SEARCHINPUT', '')
      this.$router.push({
        path: '/wcmap/page/searchHistory'
      })
    },
    update() {
      const wd = this.$route.query.wd
      this.$store.commit('searchWc/SET_SEARCHINPUT', wd)
      this.$store.dispatch('searchWc/getWcList', { query: { title: wd }, router: this.$router })
    }
  }
}
</script>
<style lang="scss" scoped>
.search-listContent {
  max-height: 70vh;
  overflow: auto;
  padding: 10px;
  .header {
    position: relative;
    display: flex;
    justify-content: flex-end;
    padding-bottom: 8px;
  }
  .listContent {
    color: #999;
    font-size: 13px;
    border-top: 1px solid #eaeaea;
    padding: 0 5px;
    cursor: pointer;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 9px 0;
      font-size: 15px;
      color: #42b983;
    }
    .listContent-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-info {
        margin-right: 8px;
        div {
          margin-bottom: 5px;
        }
      }
    }
  }
  .listContent:hover {
    background-color: #efefef;
  }
}
.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-enter {
  transform: translateY(-180px);
  opacity: 0;
}
</style>
