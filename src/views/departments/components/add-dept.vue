<template>
  <div class="add-dept">
    <el-dialog
      :visible="isDiaShow"
      title="添加部门"
      width="50%"
      @close="handleClose"
    >
      <el-form ref="addForm" label-width="100px" :model="form" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入部门编码" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="form.manager"
            placeholder="请选择部门负责人"
            @focus="getEmployees"
          >
            <el-option
              v-for="item in employees"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="form.introduce"
            type="textarea"
            placeholder="请输入部门介绍"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="addDept">确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartmentList, addDepartment } from '@/api/department'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    isDiaShow: {
      type: Boolean,
      default: false
    },
    currentDept: {
      type: Object,
      required: true
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      if (this.currentDept.name === value) {
        return callback(new Error('部门名称不能与上级名称相同'))
      } else {
        const { depts } = await getDepartmentList()
        const arr = depts.filter(item => item.pid === this.currentDept.id)
        arr.some(item => item.name === value)
          ? callback(new Error(`同级部门下${value}已经存在了`))
          : callback()
      }
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartmentList()
      depts.some(item => item.code === value)
        ? callback(new Error('有相同的编码存在'))
        : callback()
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      employees: [],
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '请输入合理的长度', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '请输入合理的长度', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '部门介绍长度在1-300之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    addDept() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          this.form.pid = this.currentDept.id
          await addDepartment(this.form)
          this.$message.success('新增部门成功')
          this.handleClose()
          this.$emit('getDepartments')
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$emit('handleClose')
      this.$refs.addForm.resetFields()
    },
    async getEmployees() {
      const res = await getEmployeeSimple()
      this.employees = res
    }
  }
}
</script>

<style></style>
