<template>
  <div>
    <div class="history-container">
      <div>搜索历史</div>
      <div
        v-for="(item, index) in searchHistory"
        :key="item.id"
        class="history-item"
        @click="handleHistoryItem(item.value)"
      >
        <div>
          <i class="el-input__icon el-icon-time" />
          <span>{{ item.value }}</span>
        </div>
        <i
          class="el-input__icon el-icon-close history-del"
          @click.stop="delHistoryItem(index)"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SearchHistory',
  data() {
    return {
      history: [
        {
          value: '人民',
          id: 1
        }
      ]
    }
  },
  computed: {
    searchHistory() {
      return this.$store.state.searchWc.searchHistory
    }
  },
  methods: {
    delHistoryItem(index) {
      this.$store.commit('searchWc/del_searchHistory', index)
    },
    handleHistoryItem(value) {
      // 改变搜索框
      this.$store.commit('searchWc/SET_SEARCHINPUT', value)
      // 获取数据
      this.$router.push({
        path: `/wcmap/page/search`,
        query: { wd: value }
      })
    }
  }
}
</script>
<style lang="scss">
.history-container {
  max-height: 300px;
  overflow: auto;
  padding: 8px;
  color: #9b9faf;
  font-size: 15px;
  .history-item {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    .history-del {
      display: none;
    }
  }
  .history-item:hover {
    background-color: #fbfbfb;
  }
  .history-item:hover .history-del {
    display: block;
  }
}
</style>
