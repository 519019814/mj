<template>
  <div class="app-container">
    <div class="filter-container" style="padding: 15px 0;">
      <div>
        <el-input
          v-model="listQuery.title"
          placeholder="搜索名称、ID···"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.area"
          clearable
          placeholder="状态"
          style="width: 140px"
          class="filter-item"
          @change="handleFilter"
        >
          <el-option
            v-for="item in toolData.areaType"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
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
      <div>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-add"
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
    </div>
    <el-table
      v-loading="tableLoading"
      :data="treeTableData"
      style="width: 100%"
      row-key="id"
      border
      :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="label"
        label="部门名称"
      />
      <el-table-column
        prop="name"
        label="部门名称"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        prop="address"
        label="操作"
        width="180"
        align="center"
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
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getDept"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="顶级部门" prop="name">
          <el-radio-group v-model="temp.level" width="140px">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="temp.status" width="140px">
            <el-radio label="published">启用</el-radio>
            <el-radio label="closed">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.level !== 1" label="上级部门" prop="pid">
          <treeselect v-model="temp.pid" :options="treeTableData" placeholder="选择上级部门" />
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
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getDept } from '@/api/dept'
export default {
  name: 'DepartmentManagement',
  directives: { permission },
  components: { DateRangePicker, Pagination, Treeselect },
  data() {
    return {
      query: '',
      depts: [],
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
      tableLoading: false,
      dept_status: [{ id: 1, enabled: true, value: '开启', name: 'published' }, { id: 1, enabled: true, value: '开启', name: 'closed' }],
      temp: {
        name: undefined,
        level: 1,
        pid: null,
        status: 'published',
        enabled: null
      },
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      total: 0,
      toolData: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: '请选择', trigger: 'blur', type: 'number' }
        ]
      },
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      },
      treeTableData: []
    }
  },
  created() {
    this.getDept()
  },
  methods: {
    handleRolesChange() {
      this.key++
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getDept()
    },
    // 列表请求
    async getDept() {
      this.tableLoading = true
      const res = await getDept(this.listQuery)
      this.treeTableData = res.data.list
      this.tableLoading = false
    },
    // 树展开加载
    async treeTableload(tree, treeNode, resolve) {
      this.listQuery.pid = tree.pid || tree.id
      const res = await getDept(this.listQuery)
      resolve(res.data.list)
    },
    resetListQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        bedType: undefined,
        sort: '-id',
        area: undefined,
        time: undefined,
        createTime: undefined
      }
    },
    resetTemp() {
      this.temp = {
        name: undefined,
        level: 2,
        pid: null,
        status: 'published',
        enabled: null
      }
    },
    checkboxT(row, rowIndex) {
      return true
    },
    // 创建
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('创建提交：', this.temp)
          this.dialogFormVisible = false
          this.resetTemp()
          this.$notify({
            title: '添加成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('将要上传的参数', this.temp)
          this.dialogFormVisible = false
          this.resetTemp()
          this.$notify({
            title: '编辑成功',
            message: '编辑成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    changeDialogFormVisible() {
      this.dialogFormVisible = false
      this.resetTemp()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 123px);
  ::v-deep .permission-alert {
    width: 320px;
    margin-top: 15px;
    background-color: #f0f9eb;
    color: #67c23a;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-block;
  }
  ::v-deep .permission-sourceCode {
    margin-left: 15px;
  }
  ::v-deep .permission-tag {
    background-color: #ecf5ff;
  }
  ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
  ::v-deep .vue-treeselect__input {
    vertical-align: inherit;
  }
}
</style>

