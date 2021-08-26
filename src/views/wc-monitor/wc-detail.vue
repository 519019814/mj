<template>
  <div class="app-container">
    <div style="margin-bottom: 11px;">
      <el-page-header content="实时监控" @back="goBack" />
    </div>
    <el-row :gutter="12">

      <el-col :span="5" :xs="24">
        <card-detail :wc-info="wcInfo" />
      </el-col>

      <el-col :span="19" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab">
            <!-- <el-tab-pane label="实时数据" name="data">
              <div class="progress-container">
                <div class="item">
                  <el-progress type="dashboard" :percentage="percentage" :color="colors" :show-text="true" :format="progressFormat" />
                  <div class="title">气味值</div>
                </div>
                <div class="item">
                  <el-progress type="dashboard" :percentage="percentage" :color="colors" :show-text="true" :format="progressFormat" />
                  <div class="title">温度</div>
                </div>
                <div class="item">
                  <el-progress type="dashboard" :percentage="percentage" :color="colors" :show-text="true" :format="progressFormat" />
                  <div class="title">本月打卡</div>
                </div>
                <div class="item">
                  <el-progress type="dashboard" :percentage="percentage" :color="colors" :show-text="true" :format="progressFormat" />
                  <div class="title">综合评分</div>
                </div>
              </div>
            </el-tab-pane> -->
            <el-tab-pane label="监控视频" name="video">
              <div style="display:flex;">
                <div class="ctrl">
                  <div class="ctrl-header">
                    <el-date-picker
                      v-model="value1"
                      type="date"
                      placeholder="选择日期"
                    />
                  </div>
                  <div class="content">
                    <div
                      v-for="(n) in 9"
                      :key="n"
                      class="item"
                      @mouseover="handleImg(n)"
                      @mouseleave="currentN = null"
                      @click="handlePlay(n)"
                    >
                      <div style="height:100px;position: relative">
                        <img class="img-item" src="https://img1.baidu.com/it/u=3001644141,3297622367&fm=26&fmt=auto&gp=0.jpg" alt="0">
                        <div
                          v-loading="isloading(n)"
                          :class="iscurrentplay(n) ? 'bg bg-base' : ''"
                          element-loading-spinner="el-icon-loading"
                          element-loading-text="正在加载..."
                          element-loading-background="rgba(0, 0, 0, 0.8)"
                        >
                          <!-- 当前正在播放时且非加载状态时 -->
                          <span v-show="isplay(n)">
                            正在播放
                          </span>
                          <!-- 鼠标被移入且当前非正在播放元素时 -->
                          <span v-show="ismouseover(n)">
                            点击播放
                          </span>
                        </div>
                      </div>
                      <div
                        :style="{color: currentN === n || playN == n ? '#1488f4': '#000'}"
                        style="color: rgb(80 80 80);font-size: 14px;text-align: center;margin-top:3px"
                      >
                        {{ '2020-0' + n +'-26' }}
                      </div>
                    </div>
                  </div>
                </div>
                <video controls width="650">
                  <source
                    src="https://minio.zjdmwh.cn/zhdm/selectContentclickByInformationId/information-pic/news/1616657614587.mp4"
                    type="video/webm"
                  >
                </video>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getWcInfo } from '@/api/wcmontior'
import CardDetail from './components/CardDetail.vue'
export default {
  name: 'WcDetail',
  components: { CardDetail },
  data() {
    return {
      percentage: 10,
      wcInfo: {},
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      user: {},
      activeTab: 'video',
      progressFormat(percentage) {
        return `${percentage}`
      },
      value1: new Date(),
      // 当前浮动
      currentN: null,
      // 当前点击，默认第一个
      playN: 1,
      loading: false
      // 同时只能加载一个视频
    }
  },
  computed: {
    ismouseover() {
      return function(n) {
        return this.currentN === n && (n !== this.playN)
      }
    },
    isloading() {
      return function(n) {
        return this.loading && this.playN === n
      }
    },
    isplay() {
      return function(n) {
        return n === this.playN && !this.loading
      }
    },
    iscurrentplay() {
      return function(n) {
        return n === this.currentN || n === this.playN
      }
    }
  },
  created() {
    // setInterval(() => {
    //   this.percentage += 20
    // }, 5000)
    // 获取信息
    const id = this.$route.params.id
    getWcInfo({ id }).then((res) => {
      this.wcInfo = res.data
    }).catch(err => console.log(err))
  },
  methods: {
    goBack() {
      this.$router.push('/wcmontior')
    },
    handleImg(n) {
      this.currentN = n
    },
    handlePlay(n) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1500)
      this.playN = n
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  background: none;
  .progress-container {
    display: flex;
    justify-content: space-around;
    .item {
      text-align: center;
      .title {
        font-size: 14px;
        color: #5d5d5d;
      }
    }
  }
  .ctrl {
    margin: 0 10px;
    flex: 1;
    .ctrl-header {
      border-bottom: 1px solid #eaeaea;
      padding: 10px 0;
      margin-bottom: 10px;
    }
    .content {
      padding: 10px;
      height: 60vh;
      overflow: auto;
      .item {
        display: inline-block;
        width: 160px;
        margin-right: 5px;
        position: relative;
        cursor: pointer;
        margin-bottom: 5px;
        img {
        height: 100px;
          width: 100%;
          border-radius: 5px;
        }
        .bg-base {
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #eaeaea;
          font-size: 14px;
        }
        .bg {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba($color: #000000, $alpha: .5);
        }
      }
    }
  }
}
::v-deep .el-loading-mask {
  background-color: rgba(0, 0, 0, 0);
  border-radius: 5px;
  .el-loading-spinner {
    .el-icon-loading {
      color: #fff;
    }
    .el-loading-text {
      color: #fff;
    }
  }
}
</style>
