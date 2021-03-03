<template>
  <div>
    <el-upload
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-change="handleChange"
      :class="{ disabled: fileComputed }"
      action=""
      :http-request="handleUpload"
      :on-remove="handleRemove"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImageUpload',
  data() {
    return {
      showDialog: false,
      imgUrl: '',
      fileList: [
        {
          url:
            'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3363295869,2467511306&fm=26&gp=0.jpg'
        },
        {
          url:
            'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2771978851,2906984932&fm=26&gp=0.jpg'
        }
      ]
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    handlePreview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleChange(file, fileList) {
      console.log(fileList)
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleUpload() {}
  }
}
</script>

<style scoped>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
