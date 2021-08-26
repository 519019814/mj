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
      区域：
      <el-select
        v-model="listQuery.bedType"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in toolData.bedType"
          :key="item.id"
          :label="item.label"
          :value="item.id"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
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
      border
      fit
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
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行政区划" width="130px">
        <template slot-scope="{ row }">
          <span>{{ row.houseType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公厕名称" min-width="110px">
        <template slot-scope="{ row }">
          <span>{{ row.businessName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抓拍" width="100px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleImgView(row)">{{
            `${row.urls.length}张`
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评分" width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.housePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人流量" width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.extent / 10 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用水" width="120px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.extent / 10 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用电" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.originalPrice }}度</span>
        </template>
      </el-table-column>
      <el-table-column label="巡栏情况" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status === "published" ? "合格" : "一般" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户评分" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status === "published" ? "合格" : "一般" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="保洁打卡" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status === "published" ? "合格" : "一般" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="软硬设施" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status === "published" ? "合格" : "一般" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'published'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row, 'published')"
          >
            开启
          </el-button>
          <el-button
            v-if="row.status != 'draft'"
            size="mini"
            @click="handleModifyStatus(row, 'draft')"
          >
            关闭
          </el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <!-- <el-form-item label="日期" prop="addTime">
          <el-date-picker
            v-model="temp.addTime"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item> -->
        <el-form-item label="标题" prop="businessName">
          <el-input v-model="temp.businessName" />
        </el-form-item>
        <el-form-item label="房间类型" prop="houseType">
          <el-input v-model="temp.houseType" />
        </el-form-item>
        <el-form-item label="售出价" prop="housePrice">
          <el-input v-model="temp.housePrice" />
        </el-form-item>
        <el-form-item label="床位" prop="numberPeople">
          <el-input v-model="temp.numberPeople" />
        </el-form-item>
        <el-form-item label="划线价" prop="originalPrice">
          <el-input v-model="temp.originalPrice" />
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
        <el-form-item label="备注">
          <el-input
            v-model="temp.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入"
          />
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
  getHotelList,
  createHotelDetail,
  updateHotelDetail,
  deleteSubscribeHouse
} from '@/api/hotel'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import ImgPriview from './components/img-priview'

export default {
  name: 'InlineEditTable',
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
        bedType: null,
        sort: '-id'
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
        businessId: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        businessName: '',
        type: '',
        status: '开启',
        casement: '1',
        houseSize: '13',
        numberPeople: 2,
        houseType: '大床房',
        urls: []
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
          { required: true, message: 'type is required', trigger: 'change' }
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
          { required: true, message: 'title is required', trigger: 'blur' }
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
      const res = await getHotelList({
        businessId: this.$store.state.user.businessId || 1,
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
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      console.log(this.listQuery.sort)
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // 重置temp
    resetTemp() {
      this.temp = {
        businessId: undefined,
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
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 编辑
    handleUpdate(row) {
      // row 当前行
      this.temp = Object.assign({}, row) // copy obj
      const tempUrls = this.temp.urls
      const urls = []
      for (const item of tempUrls) {
        urls.push({
          name: '',
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
          const tempData = Object.assign({}, this.temp)

          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateHotelDetail(tempData).then(() => {
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
    async handleDelete(row, index) {
      try {
        await deleteSubscribeHouse({
          id: row.id
        })
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
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = [
          'timestamp',
          'title',
          'type',
          'importance',
          'status'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
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
