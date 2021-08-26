<template>
  <div>
    <el-button
      size="mini"
      type="primary"
      icon="el-icon-plus"
      @click="handleCreate"
    >
      新增
    </el-button>
    <!--表格渲染-->
    <el-table ref="table" v-loading="tableLoading" :data="tableData" style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" />
      <el-table-column :show-overflow-tooltip="true" prop="rank" label="排序" />
      <el-table-column label="图片" width="400px">
        <template slot-scope="{row}">
          <div class="table-image">
            <el-image
              style="width: 100px; height: 77px;margin-right: 10px"
              :src="row.image_uri"
              :preview-src-list="[row.image_uri]"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注">
        <template slot-scope="{row}">
          <div>{{ row.remark }}</div>
        </template>
      </el-table-column>
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

    <!--表单渲染-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body :close-on-click-modal="false" width="570px" @close="changeDialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item label="排序" prop="rank">
          <el-input-number v-model="form.rank" size="mini" :min="1" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="轮播图" prop="image_uri">
          <Upload v-model="form.image_uri" />
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

import Upload from '@/components/Upload/SingleImage3'
export default {
  name: 'Carousel',
  components: { Upload },
  data() {
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
      tableLoading: false,
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      tableData: [{
        name: '图1',
        image_uri: 'https://img1.baidu.com/it/u=3001644141,3297622367&fm=26&fmt=auto&gp=0.jpg',
        rank: 1,
        createTime: '2020-01-23'
      }, {
        name: '图1',
        image_uri: 'https://element.eleme.cn/static/guide.0a8462c.png',
        rank: 2,
        createTime: '2020-04-23'
      }, {
        name: '图1',
        image_uri: 'https://img1.baidu.com/it/u=3001644141,3297622367&fm=26&fmt=auto&gp=0.jpg',
        rank: 3,
        createTime: '2020-06-23'
      }],
      form: {},
      rules: {
        title: [
          { required: true, message: '请输入名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        image_uri: [
          { required: true, message: '必须要上传一张图片', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  methods: {

    // 关闭弹窗，并reset form
    changeDialogFormVisible() {
      this.dialogFormVisible = false
      this.resetForm()
    },
    // 点击编辑单条数据
    handleUpdate(row) {
      console.log(row)
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    resetForm() {
      this.form = {}
    },
    handleCreate() {
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
    }
  }
}
</script>

