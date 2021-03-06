<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 新增按钮 -->
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              style="margin-bottom: 10px;"
              @click="showAdd"
            >新增角色</el-button>
            <el-table v-loading="loading" :data="list" border>
              <el-table-column
                width="120"
                align="center"
                label="序号"
                type="index"
                :index="indexMethod"
              />
              <el-table-column
                width="240"
                align="center"
                label="角色名称"
                prop="name"
              />
              <el-table-column align="center" label="描述" prop="description" />
              <el-table-column align="center" label="操作">
                <template v-slot="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="showAssign(row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="showEdit(row)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row
              style="height: 50px;"
              type="flex"
              justify="end"
              align="middle"
            >
              <!--
    total: 总数量
    page-size: 每页的数量  分页组件会自动计算有多少页
    current-page: 当前页时第几页
  -->
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="pagesize"
                :current-page="page"
                @current-change="handleCurrentChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 警告信息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 表单 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="companyForm.name"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="companyForm.companyAddress"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="companyForm.mailbox"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="companyForm.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-dialog
            :title="showTitle"
            :visible="showDialog"
            @close="closeDialog"
          >
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              label-width="100px"
            >
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入角色名称" />
              </el-form-item>
              <el-form-item label="角色描述" prop="description">
                <el-input
                  v-model="form.description"
                  placeholder="请输入角色描述"
                />
              </el-form-item>
            </el-form>
            <template #footer>
              <el-row type="flex" justify="center">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="addRole">确定</el-button>
              </el-row>
            </template>
          </el-dialog>
        </el-tabs>
      </el-card>
      <!-- 分配权限的弹层 -->
      <el-dialog
        title="分配权限"
        :visible="showAssignDialog"
        @close="closeAssignDialog"
      >
        <el-tree
          ref="tree"
          v-loading="treeLoading"
          :data="permissionData"
          :props="{ label: 'name' }"
          :default-expand-all="true"
          :show-checkbox="true"
          :check-strictly="false"
          node-key="id"
        />
        <template #footer>
          <div style="text-align: center;">
            <el-button @click="closeAssignDialog">取消</el-button>
            <el-button type="primary" @click="addAssign">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  delRole,
  getRoleDetail,
  editRole,
  getCompanyById,
  assignPerm
} from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { list2Tree } from '@/utils'
import { mapState } from 'vuex'
export default {
  name: 'Setting',
  data() {
    return {
      list: [],
      page: 1,
      pagesize: 5,
      total: 0,
      loading: false,
      showDialog: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      companyForm: {},
      showAssignDialog: false,
      roleId: '',
      permissionData: [],
      treeLoading: false
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    showTitle() {
      return this.form.id ? '编辑角色' : '添加角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      this.loading = true
      const { rows, total } = await getRoleList(this.page, this.pagesize)
      this.list = rows
      this.total = total
      this.loading = false
    },
    handleCurrentChange(value) {
      this.page = value
      this.getRoleList()
    },
    indexMethod(index) {
      return (this.page - 1) * this.pagesize + index + 1
    },
    showAdd() {
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        description: ''
      }
    },
    async addRole() {
      try {
        await this.$refs.form.validate()
      } catch {
        return false
      }
      if (this.form.id) {
        await editRole(this.form)
      } else {
        await addRole(this.form)
      }
      this.showDialog = false
      this.getRoleList()
      this.$message.success('添加成功')
      this.total++
      this.page = Math.ceil(this.total / this.pagesize)
    },
    async delRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
      } catch {
        return false
      }
      await delRole(id)
      this.getRoleList()
      this.$message.success('删除成功')
      if (this.list.length === 1 && this.page > 1) {
        this.page--
      }
      this.getRoleList()
    },
    async showEdit(data) {
      const res = await getRoleDetail(data.id)
      this.form = res
      this.showDialog = true
    },
    async getCompanyInfo() {
      const res = await getCompanyById(this.userInfo.companyId)
      this.companyForm = res
    },
    closeAssignDialog() {
      this.showAssignDialog = false
      this.roleId = ''
    },
    async showAssign(id) {
      this.treeLoading = true
      this.showAssignDialog = true
      this.roleId = id
      const res = await getPermissionList()
      this.permissionData = list2Tree(res, '0')
      const msg = await getRoleDetail(this.roleId)
      this.$refs.tree.setCheckedKeys(msg.permIds)
      this.treeLoading = false
    },
    async addAssign() {
      await assignPerm({
        id: this.roleId,
        permIds: this.$refs.tree.getCheckedKeys()
      })
      this.$message.success('分配成功')
      this.showAssignDialog = false
    }
  }
}
</script>

<style></style>
