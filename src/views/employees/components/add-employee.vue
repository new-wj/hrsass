<template>
  <el-dialog title="新增员工" :visible="showDialog" width="50%" @close="close">
    <!-- 表单 -->
    <el-form ref="form" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="form.username" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="form.timeOfEntry"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="form.formOfEmployment" placeholder="请选择">
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="form.workNumber" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-cascader
          v-model="form.departmentName"
          placeholder="请选择部门"
          :options="treeData"
          :props="defaultProps"
          @focus="getDepartmentList"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="form.correctionTime"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-button size="small" @click="close">取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="addEmployee"
        >确定</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartmentList } from '@/api/department'
import EmployeeEnum from '@/api/constant/employees'
import { list2Tree } from '@/utils'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum,
      form: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      treeData: [],
      rules: {
        username: [
          {
            required: true,
            message: '用户姓名不能为空',
            trigger: ['blur', 'change']
          },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            required: true,
            message: '手机号不能为空',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: ['blur']
          }
        ],
        formOfEmployment: [
          {
            required: true,
            message: '聘用形式不能为空',
            trigger: ['blur', 'change']
          }
        ],
        workNumber: [
          {
            required: true,
            message: '工号不能为空',
            trigger: ['blur', 'change']
          }
        ],
        departmentName: [
          {
            required: true,
            message: '部门不能为空',
            trigger: ['blur', 'change']
          }
        ],
        timeOfEntry: [
          {
            required: true,
            message: '请选择入职时间',
            trigger: ['blur', 'change']
          }
        ]
      },
      defaultProps: {
        label: 'name',
        value: 'name',
        expandTrigger: 'hover'
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:showDialog', false)
      this.$refs.form.resetFields()
    },
    async getDepartmentList() {
      const res = await getDepartmentList()
      this.treeData = list2Tree(res.depts)
    },
    async addEmployee() {
      try {
        await this.$refs.form.validate()
      } catch {
        return false
      }
      console.log(1111)
      await addEmployee({
        ...this.form,
        departmentName: this.form.departmentName[
          this.form.departmentName.length - 1
        ]
      })
      this.$message.success('添加成功')
      this.$parent.getEmployeeList()
      this.close()
    }
  }
}
</script>

<style></style>
