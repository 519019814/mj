<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: '2021/4/20',
          title: '权限提升',
          content: '在2019/4/20 20:46权限提升为超级管理员'
        },
        {
          timestamp: '2021/4/23',
          title: '账号创建',
          content: '与2019/4/23 20:46 创建账号'
        }
      ]
    }
  }
}
</script>
