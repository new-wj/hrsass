<template>
  <el-dialog
    class="assign-role"
    title="分配角色"
    :visible="showRoleDialog"
    width="40%"
    @close="close"
    @open="open"
  >
    <!-- 这里准备复选框 -->
    <el-checkbox-group v-model="roleIds" v-loading="loading">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <template #footer>
      <el-row type="flex" justify="center">
        <el-button type="primary" size="small" @click="assign">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>
<script>
import { getRoleList } from '@/api/setting'
import { getUserDetail } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleIds: [],
      list: [],
      loading: false
    }
  },
  methods: {
    async getRoleList() {
      const res = await getRoleList(1, 100)
      this.list = res.rows
    },
    async getUserDetail() {
      const res = await getUserDetail(this.userId)
      this.roleIds = res.roleIds
    },
    async assign() {
      await assignRoles({
        id: this.userId,
        roleIds: this.roleIds
      })
      this.$emit('update:showRoleDialog', false)
      this.$message.success('修改成功')
    },
    async open() {
      this.loading = true
      await Promise.all([this.getRoleList(), this.getUserDetail()])
      this.loading = false
    },
    close() {
      this.$emit('update:showRoleDialog')
    }
  }
}
</script>

<style></style>
