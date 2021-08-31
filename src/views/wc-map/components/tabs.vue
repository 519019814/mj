<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="温度" lazy><pie-chart :data="data1" /></el-tab-pane>
      <el-tab-pane label="湿度" lazy><pie-chart :data="data2" /></el-tab-pane>
      <el-tab-pane label="臭味" lazy><pie-chart :data="data3" /></el-tab-pane>
      <el-tab-pane
        label="一氧化碳"
        lazy
      ><pie-chart
        :data="data4"
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PieChart from './pieChart'
export default {
  name: 'Tabs',
  components: { PieChart },
  data() {
    return {
      data1: [
        { value: 2410, name: '人数' },
        { value: 102, name: '坑位' },
        { value: 1439, name: '游客' },
        { value: 100, name: '区域' }
      ],
      data2: [
        { value: 20, name: '人数' },
        { value: 240, name: '坑位' },
        { value: 49, name: '游客' },
        { value: 100, name: '区域' }
      ],
      data3: [
        { value: 32, name: '人数' },
        { value: 24, name: '坑位' },
        { value: 491, name: '游客' },
        { value: 10, name: '区域' }
      ],
      data4: [
        { value: 3320, name: '人数' },
        { value: 1240, name: '坑位' },
        { value: 1149, name: '游客' },
        { value: 1500, name: '区域' }
      ]
    }
  }
}
</script>
