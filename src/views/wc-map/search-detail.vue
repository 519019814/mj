<template>
  <div class="search-detail-container">
    <div class="d-carousel">
      <div style="text-align: right; position: absolute; left: 5px; top: 5px; z-index: 10;">
        <el-button size="mini" @click="onBackHistory">返回</el-button>
      </div>
      <el-carousel height="202px" indicator-position="none">
        <el-carousel-item v-for="item in wc.urls" :key="item">
          <el-image
            style="width: 100%; height: 202px"
            :src="item"
            :preview-src-list="wc.urls"
          />
        </el-carousel-item>
      </el-carousel>
      <div class="des">
        <div class="icon-list">
          <el-tooltip class="item" effect="dark" content="人流量：2500" placement="top">
            <i class="el-icon-view" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="气味值：30" placement="top">
            <i class="el-icon-location-outline" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="坑位：10" placement="top">
            <i class="el-icon-place" />
          </el-tooltip>
        </div>
        <el-descriptions title="概况" :column="1">
          <el-descriptions-item label="名称">{{ wc.title }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ wc.timestamp }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ wc.address }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ wc.display_time }}</el-descriptions-item>
          <el-descriptions-item label="监督电话">13256482148</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag size="small">开启</el-tag>
          </el-descriptions-item>
          <!-- 所长 监督电话 介绍 规章制度 -->
          <el-descriptions-item label="所长">{{ wc.wcLeader }}</el-descriptions-item>
          <el-descriptions-item label="介绍">
            飘香厕所，从字面意思上就可以知道它是一种厕所，特别的是这种厕所不臭，而且里面还充盈着淡淡的香味，里面如厕环境会更加的舒适，是现在国内开始新型提倡的一种环保理念厕所！此厕所目前处于向全国推广阶段中，有望在全国流行，现已有部分地区安装，如南京的洪武北路公交站点附近就有一座飘香厕所，吸引了不少人气；南京红山动物园、镇江宝华山景区等厕所也开始全部逐渐转变成这种飘香厕所！
          </el-descriptions-item>
          <el-descriptions-item label="制度">
            一、管理标准：

            1、卫生纸无霉烂、变质，严格按核定的有偿服务标准收费。

            2、职责到人，全日开放，方便群众，优质服务。

            3、工具、物品要摆放整齐。

            4、照明、供水、排污设施完好。如有损坏，要及时修复。

            5、管理房只供管理人员居住使用，不得让外人留宿或作其它用途。做好安全防范工作。

            二、卫生标准

            1、全日保洁，多次冲洗，做到无臭味。

            2、厕内持续“六面光”。做到无蛛网、无烟头、无纸屑、无杂物。

            3、定期药物消杀，做到无蚊蝇。

            4、公厕周围环境整洁，墙壁内外无乱写乱画乱贴。

            5、厕内干净，便槽畅通。无污迹、无尿碱、无便垢。
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>
<script>
import { getWcInfo } from '@/api/wcmontior'

export default {
  name: 'Place',
  data() {
    return {
      wc: {},
      isBack: true,
      tempRoute: {}
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!from.name) {
        vm.isBack = false
      }
    })
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    console.log('当前路由改变')
    setTimeout(() => {
      this.update()
    }, 0)
    next()
  },
  created() {
    this.update()
  },
  methods: {
    update() {
      const id = this.$route.params.place
      getWcInfo({ id }).then(res => {
        this.wc = res.data
        this.$store.commit('searchWc/SET_SEARCHINPUT', this.wc.title)
        this.$store.commit('searchWc/SET_CURRENTWCINFO', this.wc)
      }).catch(err => {
        console.log(err)
      })
    },
    onBackHistory() {
      if (this.isBack) {
        this.$router.go(-1)
      } else {
        this.$router.push({
          path: '/wcmap/page/searchHistory'
        })
      }
    }
  }
}
</script>
<style lang="scss">
.search-detail-container {
  .d-carousel {
    position: relative;
    .des {
      padding: 10px;
      padding-top: 15px;
      max-height: 45vh;
      overflow: auto;
      position: relative;
      .icon-list {
        position: absolute;
        right: 10px;
        top: 18px;
        i{
          margin-right: 10px;
          cursor: pointer;
          color: #999;
        }
      }
    }
  }
  ::v-deep .el-descriptions-item__content {
    text-align: justify;
  }
}
</style>
