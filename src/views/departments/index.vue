<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="isloading" class="tree-card">
        <tree-tools
          :tree-node="company"
          :is-root="isRoot"
          @addDepartment="addDepartment"
        />
        <hr>
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <template v-slot="{ data }">
            <tree-tools
              :tree-node="data"
              @addDepartment="addDepartment"
              @getDepartments="getDepartments"
            />
          </template>
        </el-tree>
      </el-card>
      <add-dept
        :is-dia-show="isDiaShow"
        :current-dept="currentDept"
        @handleClose="isDiaShow = false"
        @getDepartments="getDepartments"
      />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'
import { getDepartmentList } from '@/api/department'
import { list2Tree } from '@/utils'
export default {
  name: 'Departments',
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: {
        name: '江苏传智播客教育科技股份有限公司',
        manager: '负责人',
        id: ''
      },
      isRoot: true,
      isloading: false,
      isDiaShow: false,
      currentDept: {}
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    addDepartment(data) {
      this.currentDept = data
      this.isDiaShow = true
    },
    async getDepartments() {
      this.isloading = true
      const res = await getDepartmentList()
      this.company.name = res.companyName
      this.departs = list2Tree(res.depts)
      this.isloading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
