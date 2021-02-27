<template>
  <div class="add-dept">
    <el-dialog
      :visible="isDiaShow"
      :title="showTitle"
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
import {
  getDepartmentList,
  addDepartment,
  getDept,
  editDepartment
} from '@/api/department'
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
      const { depts } = await getDepartmentList()
      let isRepeat = false
      if (this.form.id) {
        if (value === this.currentDept.name) {
          return callback()
        }
        const arr = depts.filter(item => item.pid === this.currentDept.pid)
        isRepeat = arr.some(item => item.name === value)
      } else {
        const arr = depts.filter(item => item.pid === this.currentDept.id)
        isRepeat = arr.some(item => item.name === value)
      }
      isRepeat
        ? callback(new Error(`同级部门下${value}已经存在了`))
        : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartmentList()
      if (this.form.id) {
        if (this.currentDept.code === value) {
          return callback()
        }
      }
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
  computed: {
    showTitle() {
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    addDept() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          if (this.form.id) {
            await editDepartment(this.form)
            this.$message.success('修改部门成功')
          } else {
            this.form.pid = this.currentDept.id
            await addDepartment(this.form)
            this.$message.success('新增部门成功')
          }
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
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    },
    async getEmployees() {
      const res = await getEmployeeSimple()
      this.employees = res
    },
    async getDeptById(id) {
      this.form = await getDept(id)
    }
  }
}
</script>

<style></style>
