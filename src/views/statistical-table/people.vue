<template>
  <div class="p-container">
    <div class="filter-container">
      <div style="margin-bottom: 5px">
        搜索：
        <el-input
          v-model="listQuery.title"
          placeholder="搜索名称、ID···"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <div v-show="showMoreFilter" style="display: inline-block">
          行政区划：
          <el-select
            v-model="listQuery.area"
            clearable
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
          等级：
          <el-select
            v-model="listQuery.importance"
            clearable
            style="width: 140px"
            class="filter-item"
            @change="handleFilter"
          >
            <el-option
              v-for="item in importanceList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
          自定义时间：
          <date-range-picker v-model="listQuery.createTime" class="filter-item" />
        </div>
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
          v-waves
          class="filter-item"
          size="small"
          icon="el-icon-delete"
          @click="resetListQuery"
        >
          重置
        </el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          size="small"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >
          导出Excel
        </el-button>
        <span
          class="filter-item"
          style="color: #1890ff"
          @click="showMoreFilter = !showMoreFilter"
        >
          {{ showMoreFilter ? '合并' : '展开' }}<i :class="showMoreFilter ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
        </span>
      </div>
    </div>

    <div class="table-container">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border=""
        :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
        fit
        type="index"
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
        <el-table-column label="公厕名称" width="280px">
          <template slot-scope="{ row }">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="行政区划" width="100px">
          <template slot-scope="{ row }">
            <span>{{ row.adminArea }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公厕地址" min-width="300px">
          <template slot-scope="{ row }">
            <span>{{ row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="管理单位" width="150px">
          <template slot-scope="{ row }">
            <span>{{ row.manageUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="等级" width="90px" sortable="custom" prop="importance">
          <template slot-scope="{ row }">
            <svg-icon v-for="n in +row.importance" :key="n" color="red" icon-class="star" class="meta-item__icon" />
          </template>
        </el-table-column>
        <!-- 开始 -->
        <el-table-column v-if="type === 'people'" label="人流量" align="center" width="90px" sortable="custom" prop="people">
          <template slot-scope="{ row }">
            <span>{{ row.people }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 'temperature'" label="坑位" align="center" width="90px" sortable="custom" prop="kengwei">
          <template slot-scope="{ row }">
            <span>{{ row.people }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 'smell'" label="臭气值" align="center" width="90px" sortable="custom" prop="smell">
          <template slot-scope="{ row }">
            <span>
              <el-tag :type="row.smell > 50 ? 'danger' : 'success'">{{ row.smell }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 'nkwh'" label="用电量" align="center" width="90px" sortable="custom" prop="nkwh">
          <template slot-scope="{ row }">
            <span>{{ row.nkwh }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="type === 'water'" label="用水量" align="center" width="90px" sortable="custom" prop="water">
          <template slot-scope="{ row }">
            <span>{{ row.water }}</span>
          </template>
        </el-table-column>
        <!-- 结束 -->
        <el-table-column label="状态" class-name="status-col" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="row.status | statusFilter">
              {{ row.status === "published" ? "开启" : "关闭" }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  getWcList
} from '@/api/wcmontior'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // 基于 el-pagination
import DateRangePicker from '@/components/DateRangePicker'
export default {
  name: 'People',
  components: { Pagination, DateRangePicker },
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
  props: {
    type: {
      type: String,
      default: 'people'
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
        bedType: undefined,
        sort: '-id',
        area: undefined,
        createtime: undefined
      },
      importanceList: [{ id: 1, label: '一级' }, { id: 2, label: '二级' }, { id: 3, label: '三级' }],
      // 导出表格按钮
      downloadLoading: false,
      selectDate: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      showMoreFilter: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      // 获取列表
      const res = await getWcList({
        businessId: this.$store.state.user.businessId || 1,
        ...this.listQuery
      })
      const { total, list, toolData } = res.data
      // item轮播图字符串转换成数组
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
    resetListQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        bedType: undefined,
        sort: '-id',
        area: undefined
      }
      this.getList()
    },
    // 选中触发
    handleSelectionChange(e) {
      console.log(e)
    },
    // 排序条件发生变化触发
    sortChange(data) {
      const { prop, order } = data
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
    // 表格导出
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
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  ::v-deep .el-input--medium .el-input__icon{
    line-height: 30px;
  }
}
.p-container {
  padding: 15px;
  color: #606266;
}
.p-container ::v-deep .el-upload-list {
  max-height: 225px;
  overflow: auto;
}
</style>
