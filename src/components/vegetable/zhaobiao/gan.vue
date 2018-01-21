<template lang="pug">
  #zbgan.rou
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        import-btn(:type="type",:exportId="exportId",@my-event="loadData")
        el-button(v-if="getAccount.role === 0", type="primary", @click="exportExcel", style="margin-right: 40px; width: 180px;")
          | 导出
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .notices
            .title
              | 2018-1-25 干杂招标模板
            el-table(:data='tableData', :border="false", row-class-name="notices-row")
              el-table-column(label-class-name='notices-header', align='center', width="77", prop='num', label='序号', fixed="left")
              el-table-column(label-class-name='notices-header', align='center', prop='name', label='名 称')
              el-table-column(label-class-name='notices-header', align='center', prop='category', label='小类别')
              el-table-column(label-class-name='notices-header', align='center', prop='spec', label='规格')
              el-table-column(label-class-name='notices-header', align='center', prop='unit', label='单 位')
              el-table-column(label-class-name='notices-header', align='center', prop='business', label='供应商名称')
              el-table-column(label-class-name='notices-header', align='center', prop='unitPrice', label='单 价')
              el-table-column(label-class-name='notices-header', align='center', prop='number', label='数量')
              el-table-column(label-class-name='notices-header', align='center', prop='level', label='等级')
              el-table-column(label-class-name='notices-header', align='center', prop='spec2', label='出厂包装规格')
              el-table-column(label-class-name='notices-header', align='center', prop='barCode', label='产品条码')
              el-table-column(label-class-name='notices-header', align='center', prop='manufacturer', label='生产厂家')
              el-table-column(label-class-name='notices-header', align='center', prop='placeOfOrigin', label='出产地')
              el-table-column(label-class-name='notices-header', align='center', prop='remark', label='备注')
              el-table-column(label-class-name='notices-header', align='center', prop='serialNumber', label='食堂内部产品编号')
              el-table-column(label-class-name='notices-header', align='center', prop='url', label='实物图片')
              <!--el-table-column(label-class-name='notices-header', align='center', width="180", label='操作', fixed="right")-->
              <!--template(slot-scope='scope')-->
              <!--el-button.btn-edit(type='text', size='small',@click="edit(scope.row.id)")-->
              <!--| 审核-->
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import importBtn from '../common/importBtn'
  import CPage from '../../common/page/cPage.vue'
  import filters from '../../../core/filters/index'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'zbgan',
    components: {
      CHeader,
      importBtn,
      CPage
    },
    data () {
      return {
        menuNames: [
          {
            name: '干杂招标清单',
            route: '',
            on: true
          }
        ],
        tableData: [],
        downUrl: null,
        exportId: '',
        type: 3
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
      ...mapActions(['findDetailCopyByType']),
      loadData () {
        this.findDetailCopyByType(this.type).then((data) => {
          console.log(data)
          this.tableData = data.data
          this.downUrl = data.downUrl
          this.exportId = data.exportId
        }).catch((data) => {
          this.$alert(data.msg)
        })
      },
      exportExcel () {
        let elemIF = document.createElement('iframe')
        elemIF.src = this.downUrl
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      }
    }
  }
</script>

<style lang="less">
  #zbgan {
    width: 100%;
    height: 100%;
  }
</style>
