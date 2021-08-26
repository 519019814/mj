<template>
  <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
    <el-row>
      <el-col :span="24">
        <div style="text-align:right">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
            发布
          </el-button>
        </div>
        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
            单位名称
          </MDinput>
        </el-form-item>

        <div class="postInfo-container">
          <el-row :gutter="10">
            <el-col :span="5">
              <el-form-item label-width="70px" prop="title" label="单位名称" class="postInfo-container-item">
                <el-input
                  v-model="postForm.title"
                  placeholder="单位名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label-width="70px" label="法人代表" class="postInfo-container-item">
                <el-select v-model="postForm.author" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="搜索">
                  <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label-width="70px" label="联系电话" class="postInfo-container-item">
                <el-input
                  v-model="postForm.title"
                  placeholder="联系电话"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label-width="70px" label="所管公厕">
                <el-cascader
                  :options="options"
                  :props="props"
                  clearable
                />
                <el-button type="text" size="mini">恢复默认</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import MDinput from '@/components/MDinput'
import { getCompanyInfo } from '@/api/company'
import { searchUser } from '@/api/remote-search'
const defaultForm = {
  status: 'draft',
  title: '',
  content: '',
  content_short: '',
  source_uri: '',
  image_uri: '',
  display_time: undefined,
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false
}

export default {
  name: 'BasicInformation',
  components: { MDinput },
  props: {
    isEdit: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error('必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }]
      },
      userListOptions: [],
      props: { multiple: true },
      options: [{
        value: 1,
        label: '莲都区',
        children: [{
          value: 2,
          label: '东南镇',
          children: [
            { value: 3, label: '普陀公厕' },
            { value: 4, label: '黄埔公厕' },
            { value: 5, label: '徐汇公厕' }
          ]
        }]
      }],
      loading: false
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
  },
  methods: {
    fetchData(id) {
      getCompanyInfo({ id }).then(response => {
        this.postForm = response.data
        console.log(response)
      }).catch(err => {
        console.log(err)
      })
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        console.log(valid)
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
