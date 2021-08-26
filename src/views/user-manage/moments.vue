<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :xs="24">
        <!--工具栏-->
        <div class="filter-container">
          <div>
            <!-- 搜索 -->
            <el-input
              v-model="listQuery.title"
              clearable
              size="small"
              placeholder="输入名称或者邮箱搜索"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
            <!-- 时间选择 -->
            <date-range-picker v-model="listQuery.createTime" class="filter-item" />
            <el-button
              class="filter-item"
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleFilter"
            >
              搜索
            </el-button>
            <el-button
              class="filter-item"
              size="mini"
              icon="el-icon-delete"
              @click="resetListQuery"
            >
              重置
            </el-button>
          </div>
        </div>
        <div class="curd">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="handleCreate"
          >
            新增
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            :disabled="selectionDatas.length === 0"
            @click="resetListQuery"
          >
            批量删除
          </el-button>
        </div>
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%;"
          border=""
          :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
          @selection-change="selectionChangeHandler"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column align="center" label="发表人">
            李俊江
          </el-table-column>
          <el-table-column prop="title" align="center" label="名称" />
          <el-table-column prop="assessment" align="center" label="内容" />
          <el-table-column label="图片" width="400px">
            <template slot-scope="{row}">
              <div class="table-image">
                <el-image
                  style="width: 80px; height: 77px;margin-right: 10px"
                  :src="row.urls[0]"
                  :preview-src-list="row.urls"
                />
                <!-- <el-image
                  v-for="item in row.urls"
                  :key="item"
                  style="width: 80px; height: 77px;margin-right: 10px"
                  :src="item"
                  :preview-src-list="row.urls"
                /> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" align="center" width="150" label="版块">
            <template>
              <div>民心所向</div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" align="center" label="发表时间" width="100px">
            <template slot-scope="{row}">
              <div>{{ row.createTime }}</div>
              <div>16:18:30</div>
            </template>
          </el-table-column>
          <el-table-column align="center" width="60px" label="评论">
            <div>3</div>
          </el-table-column>
          <el-table-column align="center" width="60px" label="点赞">
            <div>3</div>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
          >
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                详情
              </el-button>
              <el-button
                size="mini"
                type="danger"
              >
                删除
              </el-button>
              <el-button type="text">更多</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--表单渲染-->
        <!--分页组件-->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getAssessment"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAssessment } from '@/api/assessment'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DateRangePicker from '@/components/DateRangePicker'
import { getRoles } from '@/api/role'
const userRoles = []
let userJobs = []
export default {
  name: 'Moments',
  components: { Pagination, DateRangePicker },
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else {
        callback()
      }
    //    else if (!isvalidPhone(value)) {
    //     callback(new Error('请输入正确的11位手机号码'))
    //   }
    }
    return {
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined,
        sort: '-id',
        id: undefined,
        pid: undefined,
        area: undefined,
        time: undefined,
        createTime: undefined
      },
      deptName: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      // 多选
      selectionDatas: [],
      dialogFormVisible: false,
      form: { id: null, title: null, remark: null, assessment: '', urls: [], score: null },
      roles: [],
      level: 3,
      tableLoading: false,
      tableData: [],
      total: 0,
      depts: [], jobs: [],
      roleDatas: [],
      selRoleDatas: [], // 多选时使用
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.getAssessment()
    this.getRoles()
  },
  methods: {
    async getAssessment() {
      this.tableLoading = true
      const res = await getAssessment(this.listQuery)
      this.tableData = res.data.list
      this.total = res.data.total
      this.tableLoading = false
    },
    async getRoles() {
      const res = await getRoles()
      this.roleDatas = res.data
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getAssessment()
    },
    handleCreate() {
      this.resetForm()
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('创建提交：', this.form)
          this.$notify({
            title: '添加成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 详情单条数据
    handleUpdate(row) {
      console.log(row)
      this.form = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('将要上传的参数', this.form)
          this.changeDialogFormVisible()
          this.$notify({
            title: '编辑成功',
            message: '编辑成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 关闭弹窗，并reset form
    changeDialogFormVisible() {
      this.dialogFormVisible = false
      this.resetForm()
    },
    resetForm() {
      this.form = { id: null, username: null, nickName: null, gender: '男', email: null, enabled: 'false', roles: [], jobs: [], dept: { id: null }, phone: null }
    },
    resetListQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined,
        sort: '-id',
        id: undefined,
        pid: undefined,
        area: undefined,
        time: undefined,
        createTime: undefined
      }
    },
    selectionChangeHandler(selection) {
      this.selectionDatas = selection
      console.log(selection)
    },
    // 匹配ID
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
    },
    changeRole(value) {
      console.log('选择了角色:', value)
    },
    changeJob(value) {
      userJobs = []
      value.forEach(function(data, index) {
        const job = { id: data }
        userJobs.push(job)
      })
    },
    deleteTag(value) {
      userRoles.forEach(function(data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
    },
    // 切换部门
    handleNodeClick(data) {
      console.log('此处更新table', data)
      if (data.pid === 0) {
        this.listQuery.deptId = null
      } else {
        this.listQuery.deptId = data.id
      }
      this.handleFilter()
    },
    // 改变状态
    changeEnabled(data, val) {
      console.log(data, val)
      if (!val) {
        this.$confirm(`此操作将 禁用"<span style="color: red">${data.nickName}</span>"账号, 是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        })
      }
    },
    // 获取弹窗内角色数据
    // getRoles() {
    //   getAll().then(res => {
    //     this.roles = res
    //   }).catch(() => { })
    // },
    // 获取弹窗内岗位数据
    getJobs() {
    },
    // 获取权限级别
    getRoleLevel() {
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
    height: calc(100vh - 123px);
    .curd {
        padding-left: 15px;
        margin-bottom: 10px;
    }
    .my-scroll-bar{
      width: 400px;
    }
}
::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
}

.dialog-rate ::v-deep .el-rate {
    line-height: 2;
}
::v-deep .el-upload-list {
  max-height: 225px;
  overflow: auto;
}
</style>
