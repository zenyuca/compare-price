<template lang="pug">
  #tbother.rou
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        el-button(type="primary", @click="exportInfo", style="margin-right: 40px; width: 180px;")
          | 导出
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .notices
            .title
              | 2018-1-25 蔬菜招标模板
            el-table(:data='tableData', :border="false", row-class-name="notices-row")
              el-table-column(label-class-name='notices-header', align='center', width="77", prop='num', label='序号', fixed="left")
              el-table-column(label-class-name='notices-header', align='center', prop='name', label='名 称')
              el-table-column(label-class-name='notices-header', align='center', prop='spec', label='规格')
              el-table-column(label-class-name='notices-header', align='center', prop='number', label='数量')
              el-table-column(label-class-name='notices-header', align='center', prop='unitPrice', label='单 价')
              el-table-column(label-class-name='notices-header', align='center', prop='agentName', label='供应商名称')
              el-table-column(label-class-name='notices-header', align='center', prop='business', label='菜品要求')
              el-table-column(label-class-name='notices-header', align='center', prop='url', label='实物图片')
              el-table-column(label-class-name='notices-header', align='center', prop='remark', label='备注')
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CPage from '../../common/page/cPage.vue'
  import importBtn from '../common/importBtn'
  import filters from '../../../core/filters/index'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'tbother',
    components: {
      CHeader,
      importBtn,
      CPage
    },
    data () {
      return {
        menuNames: [
          {
            name: '其他投标清单',
            route: '',
            on: true
          }
        ],
        tableData: [],
        type: 5
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
          this.tableData = data
        }).catch((data) => {
          this.$alert(data.msg)
        })
      },
      exportExcel () {
      }
    }
  }
</script>

<style lang="less">
  #tbother {
    width: 100%;
    height: 100%;
  }
</style>
