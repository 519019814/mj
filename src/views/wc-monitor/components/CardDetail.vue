<template>
  <div class="card-detail-container">
    <div class="d-carousel">
      <el-carousel height="202px" indicator-position="none">
        <el-carousel-item v-for="item in wcInfo.urls" :key="item">
          <el-image
            style="width: 100%; height: 202px"
            :src="item"
            :preview-src-list="wcInfo.urls"
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
          <el-descriptions-item label="名称">{{ wcInfo.title }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ wcInfo.timestamp }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ wcInfo.address }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ wcInfo.display_time }}</el-descriptions-item>
          <el-descriptions-item label="监督电话">13256482148</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag size="small">开启</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Place',
  props: {
    wcInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isBack: true,
      tempRoute: {}
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.card-detail-container {
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #FFFFFF;
  overflow: hidden;
  color: #303133;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
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
