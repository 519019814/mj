<template>
  <div class="heatmap-container">
    <el-amap
      ref="map"
      vid="amap"
      :zoom="zoom"
      :amap-manager="amapManager"
      :events="events"
      :center="center"
      class="amap-demo"
    />
    <div class="heat-table">
      <el-card class="box-card">
        <div slot="header" class="card-header">
          <div class="card-header">
            <div v-if="showBtn">
              <span style="margin-right: 8px; cursor: pointer;">今日</span>
              <span style="margin-right: 8px; cursor: pointer;">昨日</span>
              <span style="margin-right: 8px; cursor: pointer;" @click="showBtn = !showBtn">自定义</span>
              <span style="margin-right: 8px; cursor: pointer;">图表</span>
            </div>
            <div v-else>
              <span style="margin-right: 8px; cursor: pointer;" @click="showBtn = !showBtn">返回</span>
              <el-date-picker
                v-model="value2"
                type="datetimerange"
                :picker-options="pickerOptions"
                format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              />
            </div>
          </div>
          <el-link type="text" :underline="false" style="color: #b98932" @click="cardContentShow = !cardContentShow">收起</el-link>
        </div>
        <div v-show="cardContentShow" class="card-content">
          <div class="card-item" style="border-bottom: 1px solid #c5c5c5;padding-top: 0">
            <span style="width: 70%">名称</span>
            <span style="width: 20%">人流量</span>
            <span style="width: 25%">日同比</span>
          </div>
          <div v-for="(item, index) in wcList" :key="item.id" class="card-item">
            <span class="index">{{ index + 1 }}</span>
            <span style="width: 55%">{{ item.title }}</span>
            <span style="width: 20%">{{ item.heatmap_count.count }}</span>
            <span style="width: 20%">{{ item.heatmap_count.count }}%</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getWcList } from '@/api/wcmontior'
import { AMapManager } from 'vue-amap'
import PieChart from '../wc-map/components/pieChart'

// 保存热力图实例
let heatmap
export default {
  name: 'WcMap',
  comments: { PieChart },
  components: {},
  data() {
    return {
      dialogVisible: false,
      zoom: 13,
      center: [119.921833, 28.463318],
      amapManager: new AMapManager(),
      events: {
        init(map) {
          map.plugin(['AMap.Heatmap'], function() {
            // 初始化heatmap对象
            // heatmap：https://lbs.amap.com/api/javascript-api/reference/plugin ctrlf heatmap
            heatmap = new AMap.Heatmap(map, {
              radius: 25, // 给定半径
              opacity: [0, 0.8]
            })
          })
        }
      },
      cardContentShow: true,
      showBtn: true,
      wcListQuery: {
        page: 1,
        limit: 10000
      },
      wcList: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: '',
      data: [
        { value: 320, name: '人数' },
        { value: 2410, name: '坑位' },
        { value: 1439, name: '游客' },
        { value: 100, name: '区域' }
      ]
    }
  },
  mounted() {
    this.getWcList()
  },
  methods: {
    // 设置heatmap, 当路由快速切换时 500ms定时器执行，会产生错误
    setHeatMap(data) {
      setTimeout(() => {
        heatmap.setDataSet({
          data,
          max: 10
        })
      }, 500)
    },
    // 列表获取
    async getWcList() {
      this.loading = true
      getWcList(this.wcListQuery)
        .then((res) => {
          const { list } = res.data

          this.setHeatMap(list.map(value => value.heatmap_count))
          this.loading = false
          this.wcList = list
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.heatmap-container {
  height: calc(100vh - 84px);
  position: relative;
  cursor: auto;
  ::v-deep .el-card__body {
    padding: 0;
  }
  .heat-table {
    position: absolute;
    right: 10px;
    top: 20px;

    .box-card {
      width: 400px;
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color:#b98932;
        font-size: 15px;
        ::v-deep .el-date-editor {
          width: 250px;
        }
      }
      .card-content {
        overflow: auto;
        padding: 20px;
        height: 60vh;
        font-size: 14px;
        .card-item {
          padding: 18px 0px;
          display: flex;
          justify-content: space-between;
          position: relative;
          border-bottom: 1px solid rgb(236 236 236);
          .index {
            display: inline-block;
            background: #b98932;
            padding: 2px;
            margin-right: 6px;
            color: #fff;
            border-radius: 3px;
            width: 27px;
            text-align: center;
            height: 20px;

          }
        }
      }
    }

  }
}
</style>
