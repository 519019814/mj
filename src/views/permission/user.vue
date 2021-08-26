<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="filter-container" style="margin-bottom: 0;">
          <el-input
            v-model="deptName"
            clearable
            size="small"
            placeholder="输入部门名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
            @input="handleFilter"
          />
        </div>
        <el-tree
          :data="deptDatas"
          :props="defaultProps"
          :expand-on-click-node="true"
          @node-click="handleNodeClick"
        />
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
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
            <el-select
              v-model="listQuery.enabled"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 90px"
              @change="handleFilter"
            >
              <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
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
            添加
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="resetListQuery"
          >
            删除
          </el-button>
        </div>
        <!--表单渲染-->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body :close-on-click-modal="false" width="570px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model.number="form.phone" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="部门" prop="dept.id">
              <!-- 因该条数据的dept.id与实际的不匹配，会出现unknown -->
              <treeselect v-model="form.dept.id" :options="deptDatas" placeholder="选择部门" style="width: 178px" />
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="状态">
              <el-radio-group v-model="form.enabled" :disabled="form.id === user.id">
                <el-radio
                  v-for="item in dict.user_status"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
              <el-select
                v-model="selRoleDatas"
                style="width: 437px"
                multiple
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changeRole"
              >
                <el-option
                  v-for="item in roleDatas"
                  :key="item.name"
                  :disabled="level !== 1 && item.level <= level"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="changeDialogFormVisible">取消</el-button>
            <el-button
              type="primary"
              @click="dialogStatus === 'create' ? createData() : updateData()"
            >
              {{ dialogStatus === "create" ? "创建" : "编辑" }}
            </el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table ref="table" v-loading="tableLoading" :data="userTableData" style="width: 100%;" @selection-change="selectionChangeHandler">
          <el-table-column :selectable="checkboxT" type="selection" />
          <el-table-column :show-overflow-tooltip="true" prop="name" label="用户名" />
          <el-table-column :show-overflow-tooltip="true" prop="nickName" label="昵称" />
          <el-table-column prop="gender" label="性别" />
          <el-table-column :show-overflow-tooltip="true" prop="phone" label="电话" />
          <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" />
          <el-table-column :show-overflow-tooltip="true" prop="dept" label="部门">
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="enabled">
            <template slot="header">
              <el-tooltip class="item" effect="dark" content="禁用后该账号将不可登录，但保留数据" placement="right">
                <div>状态<i class="el-icon-warning-outline" /></div>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                :disabled="user.id === scope.row.id"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.enabled)"
              />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" />
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
          >
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getUsers"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUsers } from '@/api/user'
import { getDept } from '@/api/dept'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import DateRangePicker from '@/components/DateRangePicker'
import { getRoles } from '@/api/role'
const userRoles = []
let userJobs = []
export default {
  name: 'User',
  components: { Pagination, DateRangePicker, Treeselect },
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
      deptDatas: [],
      deptName: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      form: { id: null, username: null, nickName: null, gender: '男', email: null, enabled: 'false', roles: [], jobs: [], dept: { id: null }, phone: null },
      roles: [],
      level: 3,
      tableLoading: false,
      userTableData: [],
      total: 0,
      depts: [], jobs: [],
      roleDatas: [],
      selRoleDatas: [], // 多选时使用
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
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
    this.getUsers()
    this.getDeptDatas()
    this.getRoles()
  },
  methods: {
    async getUsers() {
      this.tableLoading = true
      const res = await getUsers(this.listQuery)
      this.userTableData = res.data.list
      this.total = res.data.total
      this.tableLoading = false
    },
    async getRoles() {
      const res = await getRoles()
      this.roleDatas = res.data
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getUsers()
    },
    // 获取左侧部门数据
    async getDeptDatas() {
      const res = await getDept(this.listQuery)
      this.deptDatas = res.data.list
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
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
    // 点击编辑单条数据
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
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
    selectionChangeHandler() {
      console.log('selectionChangeHandler')
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
}
  ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
