<template>
  <div class="wc-montior-container">
    <div class="filter-container m-filter">
      <el-row :gutter="20">
        <el-col :md="4" :xs="24">
          <span class="filter-label">搜索：</span>
          <el-input
            v-model="wcListQuery.title"
            label="搜索"
            placeholder="搜索名称、ID···"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :md="4" :xs="24">
          <span class="filter-label">区域：</span>
          <el-cascader

            v-model="wcListQuery.area"
            :options="options"
            class="filter-item"
            :props="{ expandTrigger: 'hover' }"
            @change="handleSelectChange"
          />
        </el-col>
        <el-col :md="4" :xs="24">
          <span class="filter-label">星级：</span>
          <el-select v-model="wcListQuery.importance" placeholder="选择星级" class="filter-item">
            <el-option
              v-for="item in importanceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :md="4" :xs="24">
          <el-button
            class="filter-item"
            size="small "
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            搜索
          </el-button>
          <el-button
            class="filter-item"
            size="small"
            icon="el-icon-delete"
            @click="handleFilter('clear')"
          >
            清空
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-row v-loading="loading" :gutter="20">
        <el-col v-for="item in wcList" :key="item.id" :md="6" :xs="24">
          <el-card :body-style="{ padding: '0px', cursor: 'pointer' }">
            <el-image :lazy="true" class="image" :src="item.urls[0]" />
            <div style="padding: 14px">
              <div class="card-header">
                <span style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ item.title }}</span>
                <el-button type="text" class="button" @click="handleView(item)">查看</el-button>
              </div>
              <div class="bottom clearfix">
                <time class="time">{{ item.address }}</time>
              </div>
              <div class="card-foot">
                <div class="card-importance">
                  {{ item.importance }}级公厕
                </div>
                <el-rate
                  v-model="item.importance"
                  disabled
                  text-color="#ff9900"
                />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <pagination
      v-show="wcTotal > 0"
      :total="wcTotal"
      :page.sync="wcListQuery.page"
      :limit.sync="wcListQuery.limit"
      @pagination="getWcList"
    />
    <el-dialog title="查看" :visible.sync="wcdialogVisible">
      <el-descriptions :title="currentView.title" :column="3" border>
        <el-descriptions-item label="公厕名" label-class-name="my-label" content-class-name="my-content">{{ currentView.title }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentView.display_time }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ currentView.address }}</el-descriptions-item>
        <el-descriptions-item label="等级">
          <el-tag size="small">{{ currentView.importance }}级</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系地址" :content-style="{'text-align': 'right'}">{{ currentView.address }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { getWcList } from '@/api/wcmontior'
import Pagination from '@/components/Pagination'
export default {
  name: 'WcMontior',
  components: { Pagination },
  data() {
    return {
      currentDate: new Date(),
      loading: true,
      wcList: [],
      wcListQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        type: undefined,
        sort: '-id',
        // 选中的区域
        area: undefined,
        importance: undefined
      },
      importanceOptions: [{
        value: 1,
        label: '一星'
      }, {
        value: 2,
        label: '二星'
      }, {
        value: 3,
        label: '三星'
      }],
      options: [],
      wcdialogVisible: false,
      currentView: {},
      toolData: [],
      wcTotal: 0
    }
  },
  watch: {},
  created() {
    this.getWcList()
  },
  mounted() {},
  methods: {
    async getWcList() {
      this.loading = true
      console.log('当前的查询条件=>', this.wcListQuery)
      getWcList(this.wcListQuery)
        .then((res) => {
          const { list, total, toolData } = res.data
          this.loading = false
          this.wcList = list
          this.toolData = toolData
          this.wcTotal = total
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },
    // 条件查询区
    handleFilter(pd) {
      if (pd === 'clear') {
        this.wcListQuery = {
          page: 1,
          limit: 20,
          title: undefined,
          type: undefined,
          bedType: null,
          sort: '-id',
          // 选中的区域
          areaValue: [],
          importance: ''
        }
      } else {
        this.wcListQuery.page = 1
      }
      this.getWcList()
    },
    // selectchange
    handleSelectChange(value) {
      console.log(value)
    },
    handleView(value) {
      this.$router.push({
        path: `/wcmontior/detail/${value.id}`
      })
      // this.currentView = value
      // this.wcdialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.wc-montior-container {
  background: #fff;
  padding: 10px;
  margin: 10px;
  .m-filter {
    border-bottom: 1px solid #ccc;
  }
  .el-col {
    margin-bottom: 12px;
  }
  .filter-label {
    font-size: 14px;
    color: #2f2f2f;
  }
  .card-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .card-importance {
      font-weight: bold;
      color: #42b983;
    }
  }
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
    height: 26px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 200px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
}
</style>
