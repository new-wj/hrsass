<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="form"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top:30px"
              :model="userInfo"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="newPassword">
                <el-input
                  v-model="userInfo.newPassword"
                  style="width:300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="update">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-tooltip class="tooltip-box" content="打印基本个人信息">
              <router-link :to="`/employees/print/${userId}?type=personal`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-tooltip class="tooltip-box" content="打印基本岗位信息">
              <router-link :to="`/employees/print/${userId}?type=job`">
                <i class="el-icon-printer" />
              </router-link>
            </el-tooltip>
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetail } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-Info'
import JobInfo from './components/job-info'
export default {
  name: 'Detail',
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        newPassword: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: ['blur']
          }
        ],
        newPassword: [
          { required: true, message: '密码不能为空', trigger: ['blur'] },
          {
            min: 6,
            max: 9,
            message: '密码长度6-9位',
            trigger: ['blur']
          }
        ]
      }
    }
  },
  created() {
    this.getUserInfo(this.userId)
  },
  methods: {
    async getUserInfo(id) {
      const res = await getUserDetail(id)
      this.userInfo.username = res.username
    },
    async update() {
      try {
        await this.$refs.form.validate()
      } catch {
        return false
      }
      await saveUserDetailById({
        id: this.userId,
        username: this.userInfo.username,
        password: this.userInfo.newPassword
      })
      if (this.userId === this.$store.getters.id) {
        this.$store.dispatch('user/getUserInfo')
      }
      this.$message.success('修改用户信息成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.employees-detail-container {
  .el-tab-pane {
    padding-top: 10px;
  }
  .tooltip-box {
    position: absolute;
    right: 30px;
    top: 10px;
    z-index: 999;
  }
}
</style>
