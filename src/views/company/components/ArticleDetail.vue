<template>
  <div class="createPost-container">
    <div class="createPost-main-container">
      <el-tabs :tab-position="'left'">
        <el-tab-pane label="基本信息">
          <basic-information :is-edit="isEdit" />
        </el-tab-pane>
        <el-tab-pane label="图文介绍">
          <div style="text-align:right">
            <el-button v-loading="loading" style="margin-left: 10px;margin-bottom: 5px" type="success" @click="submitForm">
              发布
            </el-button>
          </div>
          <Warning />
          <Tinymce ref="editor" v-model="postForm.content" :height="600" />
        </el-tab-pane>
        <el-tab-pane label="轮播图">
          <Carousel />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Tinymce from '@/components/Tinymce'
import { getCompanyInfo } from '@/api/company'
import BasicInformation from './BasicInformation.vue'
import Warning from './Warning.vue'
import Carousel from './Carousel.vue'
// 上传表单
const defaultForm = {
  content: '',
  id: undefined,
  comment_disabled: false
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, BasicInformation, Warning, Carousel },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        // this.$message({
        //   message: rule.field + '为必传项',
        //   type: 'error'
        // })
        callback(new Error('必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        content: [{ validator: validateRequire }]
      },
      tempRoute: {}
    }
  },
  computed: {
    ...mapState({
      // 读取是否开启tagsView以判断粘性条的定位值
      needTagsView: state => state.settings.tagsView
    }),
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // 时间格式化
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    //
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },

  methods: {
    fetchData(id) {
      getCompanyInfo({ id }).then(response => {
        this.postForm = response.data
        console.log(response)
        // just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // 设置tagsview title
        this.setTagsViewTitle()

        // 设置 page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {},
    setTagsViewTitle() {
      const title = '编辑详情'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.author}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '编辑详情'
      document.title = `${title} - ${this.postForm.id}`
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;
  .createPost-main-container {
    margin: 0 auto;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
    ::v-deep .el-tabs__content {
      padding: 20px;
    }
  }
  @media screen and (max-width: 580px) {
    .createPost-main-container {
      width: 100%;
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
::v-deep .el-tabs {
    margin: 20px;
    padding: 20px;
    /* height: 100vh; */
    min-height: 90vh;
    background: #fff;
}
</style>
