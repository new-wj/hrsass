<template>
  <div class="app-container">
    <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: 'Import',
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  computed: {
    type() {
      return this.$route.query.type
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return (
          year +
          format +
          (month < 10 ? '0' + month : month) +
          format +
          (date < 10 ? '0' + date : date)
        )
      }
      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
    },
    async handleSuccess({ results, header }) {
      if (this.type === 'employee') {
        const userRelations = {
          入职日期: 'timeOfEntry',
          手机号: 'mobile',
          姓名: 'username',
          转正日期: 'correctionTime',
          工号: 'workNumber',
          聘用形式: 'formOfEmployment',
          部门: 'departmentName'
        }
        const arr = results.map(item => {
          const obj = {}
          for (const key in item) {
            if (['入职日期', '转正日期'].includes(key)) {
              obj[userRelations[key]] = this.formatDate(item[key], '-')
            } else if (['聘用形式'].includes(key)) {
              obj[userRelations[key]] = item[key] === '正式' ? 1 : 2
            } else {
              obj[userRelations[key]] = item[key]
            }
          }
          return obj
        })
        await importEmployee(arr)
        this.$message.success('导入成功')
        this.$router.back()
      } else {
        return
      }
    }
  }
}
</script>
