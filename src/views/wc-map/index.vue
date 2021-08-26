<template>
  <div class="amap-container">
    <el-amap
      ref="map"
      vid="amap"
      :zoom="zoom"
      :amap-manager="amapManager"
      :events="events"
      :center="currentWcInfo.position || center"
      class="amap-demo"
    >
      <el-amap-marker
        v-for="(item, index) in wcList"
        :key="item.id"
        :position="item.position"
        :events="item.events"
        :title="item.title"
        :icon="item.icon"
        :vid="item.id"
        :animation="item.animation"
        :clickable="item.clickable"
        :z-index="markerLabel === item.id ? 10 : ''"
        :label="markerLabel === item.id ? item.label : ''"
        :index="index"
      />
    </el-amap>
    <div id="search" class="search-container">
      <el-input v-model="searchInput" :value="$store.state.searchInput" placeholder="搜索名称、位置、内容" class="input-with-search" clearable @keyup.enter.native="onSearch()">
        <i slot="append" class="el-input__icon el-icon-search" :style="{fontSize: '15px', cursor: 'pointer'}" title="搜索" @click="onSearch" />
      </el-input>
      <div class="search-content">
        <transition name="fade-transform" mode="out-in" duration="100">
          <router-view />
        </transition>
      </div>
    </div>
    <div class="chart">
      <Tabs />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { AMapManager } from 'vue-amap'
import Tabs from './components/tabs'
export default {
  name: 'WcMap',
  components: { Tabs },
  data() {
    return {
      dialogVisible: false,
      zoom: 13,
      center: [119.921833, 28.463318],
      amapManager: new AMapManager(),
      // searchList: [],
      currentMarker: {},
      markers: [],
      events: {
        init(map) {
        }
      },
      searchPanl: true,
      listContent: false,
      noData: false,
      history: [{
        value: '人民',
        id: 1
      }],
      firstSearch: true
    }
  },
  computed: {
    ...mapGetters([
      'currentWcInfo',
      'wcList',
      'searchHistory',
      'markerLabel'
    ]),
    searchInput: {
      get() {
        return this.$store.state.searchWc.searchInput
      },
      set(value) {
        this.$store.commit('searchWc/SET_SEARCHINPUT', value)
      }
    }
  },
  mounted() {
  // 点击任意位置关闭区域弹窗
    document.addEventListener('click', (e) => {
      // 获取弹窗对象
      const userCon = document.getElementById('search')
      // 判断弹窗对象中是否包含点击对象
      if (userCon && !userCon.contains(e.target)) {
        // 如果包含则跳转回之前的页面
      }
    })
  },
  methods: {
    onSearch() {
      if (this.searchInput !== '') {
        // 添加一条历史记录
        this.$store.commit('searchWc/set_searchHistory', this.searchInput)
      }
      this.$router.push({
        path: `/wcmap/page/search`,
        query: { wd: this.searchInput }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.amap-container {
  height: calc(100vh - 84px);
  position: relative;
  cursor: auto;
  .search-container {
    position: absolute;
    left: 10px;
    top: 20px;
    width: 370px;
    .input-with-search {
      z-index: 10;
    }
    .search-content {
      background-color: #fff;
      box-shadow: 2px 2px 2px rgb(0 0 0 / 10%);
      border-radius: 3px;
    }
    ::v-deep .el-input__inner {
      height: 39px;
    }
  }
  .chart {
    position: absolute;
    right: 10px;
    top: 20px;
  }
  ::v-deep .amap-marker-label {
    position: relative;
    min-width: 80px;
    text-align: center;
    background: #fff;
    border-radius: 2px;
    border: none;
    padding: 6px;
    -webkit-box-shadow: 0 0 8px 0 rgb(0 0 0 / 20%);
    -moz-box-shadow: 0 0 8px 0 rgba(0,0,0,.2);
    box-shadow: 0 0 8px 0 rgb(0 0 0 / 20%);
  }
}

</style>
