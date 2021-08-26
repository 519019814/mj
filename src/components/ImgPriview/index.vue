<template>
  <div class="app-container">
    <el-card>
      <div class="c-img-body">
        <el-carousel v-if="srcList.length > 1" height="450px">
          <el-carousel-item v-for="(item, i) in srcList" :key="i">
            <div class="cc-ta--c cc-pad-10">
              <el-image
                :src="item"
                alt=""
                style="width: 400px; height: 200px"
                fit="contain"
              />
            </div>
          </el-carousel-item>
        </el-carousel>
        <el-image v-else :src="srcList[0]" alt="" />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    srcList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      imgsArr: []
    }
  },
  methods: {
    handleImgClick(item, index) {
      console.log('index', item)
    }
  }
}
</script>
<style lang='scss' scoped>
.c-img-body {
  display: grid;
  .el-image {
    width: 100%;
    height: 100%;
  }
  .el-carousel__item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
