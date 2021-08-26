<template>
  <div class="inline-edit-container">
    <div class="filter-container">
      搜索：
      <el-input
        v-model="listQuery.title"
        placeholder="搜索名称、ID···"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        size="small"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        size="small"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
      fit
      stripe
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column
        label="编号"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位名称" min-width="110px">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="法人代表" width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.legal_person }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="100px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleImgView(row)">{{
            `${row.urls.length}张`
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理公厕" sortable="custom" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.wc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <router-link :to="'/company/edit/'+row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button> -->
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left: 4px"
            @onConfirm="handleDelete(row, $index)"
          >
            <el-button
              v-if="row.status != 'deleted'"
              slot="reference"
              size="mini"
              type="danger"
            >
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="changeDialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="介绍">
          <el-input
            v-model="temp.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="行政区划" prop="houseType">
          <el-select
            v-model="temp.area"
          >
            <el-option
              v-for="item in toolData.areaType"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="人流量" prop="people">
          <el-input v-model="temp.people" />
        </el-form-item>
        <el-form-item label="面积" prop="floorage">
          <el-input v-model="temp.floorage" />
        </el-form-item>
        <el-form-item label="坑位" prop="people">
          <el-input v-model="temp.people" />
        </el-form-item>
        <el-form-item label="轮播图" prop="urls">
          <el-upload
            class="upload-demo"
            action="http://ruian.zjdmwh.cn:8088/API/verify/page/information/picture/one?"
            :data="{ informationTypeId: 1 }"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleUpdateSuccess"
            :file-list="temp.urls"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="temp.status"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDialogFormVisible"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ dialogStatus === "create" ? "创建" : "编辑" }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >确认</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogImgPriview" title="图片预览">
      <ImgPriview :src-list="srcList" />
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogImgPriview = false"
        >确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv } from '@/api/article'
import {
  createHotelDetail,
  updateHotelDetail
} from '@/api/hotel'
import { getCompanyList } from '@/api/company'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import ImgPriview from '@/components/ImgPriview'

export default {
  name: 'Companys',
  components: { Pagination, ImgPriview },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      // return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      toolData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '-id',
        area: undefined
      },
      srcList: [],
      ImageUrl: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      importanceOptions: [1, 2, 3],
      statusOptions: ['商家', '关闭', '删除'],
      showReviewer: false,
      temp: {
        importance: 1,
        remark: '',
        timestamp: new Date(),
        type: '',
        status: '开启',
        casement: '1',
        urls: [],
        area: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      dialogImgPriview: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        businessName: [
          { required: true, message: '名字是必填项', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.srcList = []
  },
  methods: {
    async getList() {
      this.listLoading = true
      // 获取列表
      const res = await getCompanyList({
        ...this.listQuery
      })
      const { total, list, toolData } = res.data
      this.list = list
      this.total = total
      this.toolData = toolData
      this.listLoading = false
    },
    // 触发条件查询，page置为1
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    // 选中触发
    handleSelectionChange(e) {
      console.log(e)
    },
    // 排序条件发生变化触发
    sortChange(data) {
      const { prop, order } = data
      console.log(data)
      if (order === null) return
      this.sortByEverything(order, prop)
    },
    // 基础的升降条件排序
    sortByEverything(order, condition) {
      if (order === 'ascending') {
        this.listQuery.sort = '+' + condition
      } else {
        this.listQuery.sort = '-' + condition
      }
      this.handleFilter()
    },
    // 重置temp
    resetTemp() {
      this.temp = {
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: '',
        urls: []
      }
    },
    changeDialogFormVisible() {
      this.dialogFormVisible = false
      this.resetTemp()
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.businessId = this.$store.state.user.businessId
          createHotelDetail(this.temp)
            .then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '添加成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    },
    // 编辑
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      const tempUrls = this.temp.urls
      const urls = []
      for (const item of tempUrls) {
        urls.push({
          name: 'uupp',
          url: item
        })
      }
      this.temp.urls = urls
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 图片转换成字符串发送
          // 这里把包装好的urls对象转成字符串发送后端
          this.$notify({
            title: 'Success',
            message: '编辑成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
          const tempData = Object.assign({}, this.temp)

          tempData.businessId = this.$store.state.user.businessId
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateHotelDetail(tempData).then(() => {
            // 这里请求发送成功再把字符串对象转回来
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      try {
        // await deleteSubscribeHouse({
        //   id: row.id,
        // });
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        // 删除成功之后todo
        this.list.splice(index, 1)
      } catch (error) {
        console.log(error)
      }
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const filename = '公厕列表' + new Date().getTime()
        const tHeader = ['id', '创建时间', '名称', '行政区划', '星级', '状态']
        const filterVal = [
          'id',
          'timestamp',
          'businessName',
          'houseType',
          'importance',
          'status'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename
        })
        this.downloadLoading = false
      })
    },
    // 图片预览点击事件
    handleImgView(row) {
      this.srcList = row.urls
      this.dialogImgPriview = true
    },
    handleRemove(file, fileList) {
      console.log(fileList)
    },
    handleUpdateSuccess(response, file, fileList) {
      const imgObj = {
        name: file.name,
        url: response.data,
        uid: new Date().getTime()
      }
      this.temp.urls.push(imgObj)
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      this.srcList = [file.url]
      this.dialogImgPriview = true
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style lang="scss" scoped>
.inline-edit-container {
  padding: 15px;
}
.inline-edit-container ::v-deep .el-upload-list {
  max-height: 225px;
  overflow: auto;
}
</style>
