<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template #left>共166条记录</template>
        <template #right>
          <el-button
            type="warning"
            size="small"
            @click="$router.push('/import')"
          >导入</el-button>
          <el-button type="danger" size="small">导出</el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column label="序号" sortable type="index" width="120" />
          <el-table-column label="姓名" sortable prop="username" />
          <el-table-column label="工号" sortable prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable prop="departmentName" />
          <el-table-column label="入职时间" sortable prop="timeOfEntry">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable prop="enableState">
            <template v-slot="{ row }">
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="delEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            background
            :page-size="pagesize"
            :current-page="page"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
      <add-employee :show-dialog.sync="showDialog" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
export default {
  name: 'Employees',
  components: {
    AddEmployee
  },
  data() {
    return {
      list: [],
      page: 1,
      pagesize: 10,
      total: 0,
      loading: false,
      showDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page, this.pagesize)
      this.total = total
      this.list = rows
      this.loading = false
    },
    handleCurrentChange(value) {
      this.page = value
      this.getEmployeeList()
    },
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : ''
    },
    async delEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工么？', '温馨提示', {
          type: 'warning'
        })
      } catch {
        return false
      }
      await delEmployee(id)
      this.getEmployeeList()
      this.$message.success('删除成功')
    }
  }
}
</script>

<style></style>
