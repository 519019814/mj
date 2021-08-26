<template>
  <div class="app-container profile-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="5" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="19" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="账号" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="操作日志" name="timeline">
                <timeline />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'ProfileIndex',
  components: { UserCard, Timeline, Account },
  data() {
    return {
      user: {},
      activeTab: 'account',
      active: 0
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.profile-container {
  min-height: calc(80vh);
}
</style>
