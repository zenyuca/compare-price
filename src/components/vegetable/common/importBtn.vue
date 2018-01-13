<template lang="pug">
  .btn-export.btn-upload(@click="inputExcel")
    | 导入
    input(id="input-file", type="file", accept="application/vnd.ms-excel", @change="uploadExcel($event)")
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CPage from '../../common/page/cPage.vue'
  import filters from '../../../core/filters/index'
  import { mapGetters, mapActions } from 'vuex'
  import { Loading } from 'element-ui'

  export default {
    name: 'rou',
    components: {
      CHeader,
      CPage
    },
    data () {
      return {
      }
    },
    created () {
    },
    destroyed () {
    },
    mounted () {
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      ...filters,
      ...mapActions([]),
      loadData () {
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
