<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template #left>共166条记录</template>
        <template #right>
          <el-button
            v-if="checkPermission('EMPLOYEE-IMPORT')"
            type="warning"
            size="small"
            @click="$router.push('/import?type=employee')"
          >导入</el-button>
          <el-button
            v-if="checkPermission('EMPLOYEE-EXPORT')"
            type="danger"
            size="small"
            @click="exportExcel"
          >导出</el-button>
          <el-button
            v-if="checkPermission('EMPLOYEE-ADD')"
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
          <el-table-column label="头像" align="center">
            <template v-slot="{ row }">
              <img
                v-imgerror="defaultImg"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
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
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="editRole(row.id)"
              >角色</el-button>
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
      <assign-role :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
      <el-dialog width="40%" title="二维码" :visible.sync="showCodeDialog">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import AssignRole from './components/assign-role'
import moment from 'moment'
import QrCode from 'qrcode'
import permission from '@/mixins/permission'
export default {
  name: 'Employees',
  components: {
    AddEmployee,
    AssignRole
  },
  mixins: [permission],
  data() {
    return {
      list: [],
      page: 1,
      pagesize: 10,
      total: 0,
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: '',
      defaultImg: require('@/assets/common/bigUserHeader.png')
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
    },
    // 导出表格
    exportExcel() {
      const headers = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      this.downloadLoading = true
      // 异步导入的目的：提高性能，只要用到导出功能的时候，才会去加载导出的js
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList(this.page, this.total)
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          // 表头
          header: Object.keys(headers),
          // 数据
          data,
          // 文件名
          filename: '员工资料表',
          multiHeader,
          merges,
          // 自动宽度
          autoWidth: true,
          // 后缀名
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },

    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            if (item[headers[key]] === null) {
              return item[headers[key]]
            } else {
              return moment(item[headers[key]]).format('YYYY-MM-DD')
            }
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(
              obj => obj.id === item[headers[key]]
            )
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    async showQrCode(staffPhoto) {
      if (!staffPhoto) return
      // 显示弹窗
      this.showCodeDialog = true
      // 把图片地址生成二维码
      // console.log(staffPhoto)
      // 参数1： canvas标签
      // 参数2：具体的网址
      // console.log(this.$refs.myCanvas)
      await this.$nextTick()
      QrCode.toCanvas(this.$refs.myCanvas, staffPhoto)
    },
    editRole(id) {
      this.showRoleDialog = true
      this.userId = id
    }
  }
}
</script>

<style></style>
