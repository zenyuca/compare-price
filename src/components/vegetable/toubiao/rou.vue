<template lang="pug">
  #tbrou.rou
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        el-button(type="primary", @click="exportInfo", style="margin-right: 40px; width: 180px;")
          | 导出
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .notices
            .title
              | 肉类投标结果，以{{endTime}}之后数据为准
            el-table(:data='tableData', :border="true", row-class-name="notices-row")
              el-table-column(label-class-name='notices-header', align='center', width="77", prop='num', label='序号', fixed="left")
              el-table-column(label-class-name='notices-header', align='center', prop='category', label='类别')
              el-table-column(label-class-name='notices-header', align='center', prop='name', label='名 称')
              el-table-column(label-class-name='notices-header', align='center', prop='spec', label='规格')
              el-table-column(label-class-name='notices-header', align='center', prop='unit', label='单 位')
              el-table-column(label-class-name='notices-header', align='center', prop='agentName', label='供应商名称')
              el-table-column(label-class-name='notices-header', align='center', prop='unitPrice', label='单 价')
              el-table-column(label-class-name='notices-header', align='center', prop='number', label='数量')
              el-table-column(label-class-name='notices-header', align='center', prop='remark', label='备注')
              el-table-column(label-class-name='notices-header', align='center', prop='', label='实物图片')
                template(slot-scope='scope')
                  img.table-img(v-if="scope.row.url", :src="scope.row.url", title="点击预览", @click="imgPreview(scope.row.url)")
              el-table-column(label-class-name='notices-header', align='center', prop='remarks1', label='备注1')
              el-table-column(label-class-name='notices-header', align='center', prop='remarks2', label='备注2')
            el-dialog(v-model="dialogVisible", size="small")
              img(width="100%", :src="dialogImageUrl", alt="")
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CPage from '../../common/page/cPage.vue'
  import importBtn from '../common/importBtn'
  import filters from '../../../core/filters/index'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'tbrou',
    components: {
      CHeader,
      importBtn,
      CPage
    },
    data () {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        menuNames: [
          {
            name: '肉类投标清单',
            route: '',
            on: true
          }
        ],
        tableData: [],
        type: 2,
        endTime: ''
      }
    },
    created () {
      this.loadData()
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
      ...mapActions(['findTenderResult', 'exportTenderResult']),
      loadData () {
        let data = {
          type: this.type,
          agentId: this.getAccount.id
        }
        this.findTenderResult(data).then((data) => {
          if (!data) {
            return
          }
          this.tableData = data
          if (this.tableData[0] && this.tableData[0].endTime) {
            this.endTime = new Date(this.tableData[0].endTime).Format('yyyy-MM-dd hh:mm:ss')
          }
        }).catch((data) => {
          this.$alert(data.msg)
        })
      },
      exportInfo () {
        let data = {
          type: this.type,
          agentId: this.getAccount.id
        }
        const newTab = window.open('about:blank')
        this.exportTenderResult(data).then((url) => {
          newTab.location.href = url
          window.open(url)
        })
      },
      handlePreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      imgPreview (url) {
        this.handlePreview({url})
      }
    }
  }
</script>

<style lang="less">
  #tbrou {
    width: 100%;
    height: 100%;
    .list {
      overflow-x: hidden;
    }
    .table-img {
      width: 50px;
      height: 50px;
      cursor: pointer;
    }
  }
</style>
