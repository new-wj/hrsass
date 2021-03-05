<template>
  <div>
    <el-upload
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-change="handleChange"
      :class="{ hidden: isHiddenIcon }"
      action=""
      :http-request="handleUpload"
      :on-remove="handleRemove"
      :limit="limit"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="isShowProgress"
      :percentage="percentage"
      style="width: 180px"
    />
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
import uuid from 'uuid-v4'
const cos = new COS({
  SecretId: 'AKIDPoyyiC7lpfXDWGcokPn4MQXv5tUriVeH',
  SecretKey: 'FG2X1JMABrMddkddPhNpdBVzbxQOAkSv'
})
export default {
  name: 'ImageUpload',
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showDialog: false,
      imgUrl: '',
      fileList: [],
      isShowProgress: false,
      percentage: 0
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    isHiddenIcon() {
      return this.fileList.length >= this.limit
    }
  },
  methods: {
    handlePreview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    beforeUpload(file) {
      const accepts = ['image/gif', 'image/png', 'image/jpeg']
      if (!accepts.includes(file.type)) {
        this.$message.warning('上传的图片格式错误')
        return false
      }
      if (file.size / 1024 / 1024 >= 1) {
        this.$message.warning('上传的文件不能超过1MB')
        return false
      }
      return true
    },
    handleUpload({ file }) {
      this.isShowProgress = true
      cos.putObject(
        {
          Bucket: 'pmzqwj-1305126822' /* 必须 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，必须字段 */,
          Key: uuid() + '-' + file.name /* 必须 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: data => {
            this.percentage = data.percent * 100
          }
        },
        (err, data) => {
          if (err) return
          if (data.statusCode === 200) {
            const obj = this.fileList.find(item => item.uid === file.uid)
            obj.status = 'success'
            obj.url = 'https://' + data.Location
            this.isShowProgress = false
            this.percentage = 0
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden {
  ::v-deep {
    .el-upload--picture-card {
      display: none;
    }
  }
}
</style>
