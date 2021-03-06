<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button
            type="primary"
            size="small"
            @click="showAdd(1, '0')"
          >添加权限</el-button>
        </div>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button
                :disabled="row.type !== 1"
                size="small"
                type="text"
                @click="showAdd(2, row.id)"
              >添加权限点</el-button>
              <el-button
                size="small"
                type="text"
                @click="detailPermisson(row.id)"
              >查看</el-button>
              <el-button
                size="small"
                type="text"
                @click="delPermisson(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-dialog
        :visible.sync="showDialog"
        width="50%"
        :title="showTitle"
        @close="close"
      >
        <!-- 表单内容 -->
        <el-form ref="form" label-width="100px" :rules="rules">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="权限启用">
            <el-switch
              v-model="formData.enVisible"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              active-text="启用"
              inactive-text="未启用"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <div style="text-align: center;">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="addPermisson">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  delPermission,
  getPermissionDetail,
  updatePermission
} from '@/api/permisson'
import { list2Tree } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: ['blur'] }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: ['blur'] }
        ]
      }
    }
  },
  computed: {
    showTitle() {
      if (this.formData.id) {
        return '编辑权限'
      } else {
        return '新增权限'
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    close() {
      this.showDialog = false
      this.formData = {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
    },
    async getPermissionList() {
      const res = await getPermissionList()
      this.list = list2Tree(res, '0')
    },
    showAdd(type, pid) {
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    async addPermisson() {
      try {
        await this.$refs.form.validate()
      } catch {
        return false
      }
      if (!this.formData.id) {
        await addPermission(this.formData)
        this.$message.success('新增权限成功')
      } else {
        await updatePermission(this.formData)
        this.$message.success('修改权限成功')
      }
      this.close()
      this.getPermissionList()
    },
    async delPermisson(id) {
      try {
        await this.$confirm('您确定删除该权限么？', '温馨提示', {
          type: 'warning'
        })
      } catch {
        return false
      }
      await delPermission(id)
      this.$message.success('删除成功')
      this.getPermissionList()
    },
    async detailPermisson(id) {
      this.showDialog = true
      this.formData = await getPermissionDetail(id)
    }
  }
}
</script>

<style></style>
