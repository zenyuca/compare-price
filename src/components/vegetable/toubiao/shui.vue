<template lang="pug">
  #tbshui.rou
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        el-button(type="primary", @click="exportInfo", style="margin-right: 40px; width: 180px;")
          | 导出
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .notices
            .title
              | {{endTime}} 冻品投标结果
            el-table(:data='tableData', :border="true", row-class-name="notices-row")
              el-table-column(label-class-name='notices-header', align='center', width="77", prop='num', label='序号', fixed="left")
              el-table-column(label-class-name='notices-header', align='center', prop='category', label='类别')
              el-table-column(label-class-name='notices-header', align='center', prop='name', label='名 称')
              el-table-column(label-class-name='notices-header', align='center', prop='spec', label='规格')
              el-table-column(label-class-name='notices-header', align='center', prop='unit', label='单 位')
              el-table-column(label-class-name='notices-header', align='center', prop='agentName', label='供应商名称')
              el-table-column(label-class-name='notices-header', align='center', prop='unitPrice', label='单 价')
              el-table-column(label-class-name='notices-header', align='center', prop='number', label='数量')
              el-table-column(label-class-name='notices-header', align='center', prop='level', label='等级')
              el-table-column(label-class-name='notices-header', align='center', prop='spec2', label='出厂包装规格')
              el-table-column(label-class-name='notices-header', align='center', prop='barCode', label='产品条码')
              el-table-column(label-class-name='notices-header', align='center', prop='manufacturer', label='生产厂家')
              el-table-column(label-class-name='notices-header', align='center', prop='placeOfOrigin', label='出产地')
              el-table-column(label-class-name='notices-header', align='center', prop='remark', label='备注')
              el-table-column(label-class-name='notices-header', align='center', prop='serialNumber', label='食堂内部产品编号')
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
  import importBtn from '../common/importBtn'
  import CPage from '../../common/page/cPage.vue'
  import filters from '../../../core/filters/index'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'tbshui',
    components: {
      CHeader,
      importBtn,
      CPage
    },
    data () {
      return {
        dialogVisible: false,
        menuNames: [
          {
            name: '冻品投标清单',
            route: '',
            on: true
          }
        ],
        tableData: [],
        type: 4,
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
      ...mapGetters([])
    },
    methods: {
      ...filters,
      ...mapActions(['findTenderResult', 'exportTenderResult']),
      loadData () {
        this.findTenderResult(this.type).then((data) => {
          if (!data) {
            return
          }
          this.tableData = data
          if (this.tableData[0] && this.tableData[0].endTime) {
            this.endTime = new Date(this.tableData[0].endTime).Format('yyyy-MM-dd')
          }
        }).catch((data) => {
          this.$alert(data.msg)
        })
      },
      exportInfo () {
        const newTab = window.open('about:blank')
        this.exportTenderResult(this.type).then((url) => {
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
  #tbshui {
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
