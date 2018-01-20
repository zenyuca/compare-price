<template lang="pug">
  div(style="float: left;")
    el-button(type="default", v-if="getAccount.role === 1", @click="showForm = true", style="margin-right: 40px; width: 180px;")
      | 导入
    el-dialog(v-if="getAccount.role === 1", v-model="showForm", size="tiny", title="导入招标模板")
      el-form(:model="info", :rules="rules", ref="ruleForm", label-position="top", class="public-form")
        el-form-item(label="标题", prop="title")
          el-input(v-model="info.title")
        el-form-item(label="招标截止日期：", prop="endDate")
          el-date-picker(v-model='info.endDate', type='date', style="width: 100%", align='right', placeholder='截止日期')
        el-form-item(label="招标文件：", prop="fileList")
          el-upload(class="upload-demo", action="https://jsonplaceholder.typicode.com/posts/", :on-success="onSuccess", :on-remove="handleRemove", :file-list="info.fileList", list-type="picture-card")
            i.el-icon-plus
        el-form-item.bar-btn(style="padding-bottom: 0px;")
          el-button(type="primary", @click="sure")
            | 确定
    .btn-export.btn-upload(v-if="getAccount.role === 0", @click="inputExcel")
      | 导入
      input(id="input-file", type="file", accept="application/vnd.ms-excel", @change="uploadExcel($event)")
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CPage from '../../common/page/cPage.vue'
  import filters from '../../../core/filters/index'
  import { mapGetters, mapActions } from 'vuex'
  import { Loading } from 'element-ui'
  import _ from 'lodash'

  export default {
    name: 'rou',
    components: {
      CHeader,
      CPage
    },
    props: {
      type: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        showForm: false,
        info: {},
        rules: {
          title: [
            { required: true, message: '请输入表格题目', trigger: 'blur' }
          ],
          endDate: [
            { required: true, message: '请选择截止日期', trigger: 'blur' }
          ],
          fileList: [
            { required: true, message: '请上传模板文件', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      alert(this.type)
    },
    destroyed () {
    },
    mounted () {
    },
    computed: {
      ...mapGetters(['getAccount'])
    },
    methods: {
      ...filters,
      ...mapActions([]),
      sure () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            alert('add')
          } else {
            return false
          }
        })
      },
      loadData () {
      },
      // 上传成功
      onSuccess (response, file, files) {
        this.activity.pictures.push(response.data)
      },
      handleRemove (file, files) {
        this.getRemoveId(file.id)
        let id = file.id || file.response.data.id
        this.activity.pictures = _.remove(this.activity.pictures, (e) => {
          return e.id !== id
        })
      },
      uploadExcel (event) {
        let element = event.currentTarget
        let formData = new FormData()
        formData.append('file', element.files[0])
        let size = element.files[0].size
        let num = 20
        if (size >= (num * 1024 * 1024)) {
          this.$alert(`只能上传小于${num}M的文件`, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
          return
        }
        this.tableData = []
        this.loadingInstance = Loading.service({text: `文件上传中，请耐心等待……`})
        this.importSalaryBillExcel(formData).then((data) => {
          this.filed = data.header
          for (let item of data.data) {
            this.tableData.push(item)
          }
          let fileE = document.getElementById('input-file')
          fileE.value = ''
          this.loadingInstance.close()
          console.log(JSON.stringify(this.tableData, null, 2))
        }).catch((data) => {
          alert(data.msg)
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="less">
  #rou {
    width: 100%;
    height: 100%;
  }
</style>
