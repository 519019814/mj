<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>你好</div>
          {{ user.role }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.username }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <div>
            <svg-icon icon-class="education" />
            <span>身份</span>
          </div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              超级管理员
            </div>
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <div>
            <svg-icon icon-class="education" />
            <span>所属部门</span>
          </div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              开发部
            </div>
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <div>
            <svg-icon icon-class="education" />
            <span>手机号码</span>
          </div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              18888888888
            </div>
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <div>
            <svg-icon icon-class="education" />
            <span>用户邮箱</span>
          </div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              admin@el-admin.vip
            </div>
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <div>
            <svg-icon icon-class="education" />
            <span>安全设置</span>
          </div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              <a class="text-change" style="margin-right: 5px">修改密码</a>
              <a class="text-change">修改邮箱</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #ebeef4;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 5px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #ebeef4;
      padding-bottom: 12px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .text-change {
      color: #317ef3;
      font-weight: normal;
    }
  }
}
</style>
