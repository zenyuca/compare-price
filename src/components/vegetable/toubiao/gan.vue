<template lang="pug">
  #tbgan.rou
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        el-button(type="primary", @click="exportInfo", style="margin-right: 40px; width: 180px;")
          | 导出
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .notices
            .title
              | {{endTime}} 干杂投标结果
            el-table(:data='tableData', :border="true", row-class-name="notices-row")
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
  import importBtn from '../common/importBtn'
  import CPage from '../../common/page/cPage.vue'
  import filters from '../../../core/filters/index'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'tbgan',
    components: {
      CHeader,
      importBtn,
      CPage
    },
    data () {
      return {
        menuNames: [
          {
            name: '干杂投标清单',
            route: '',
            on: true
          }
        ],
        tableData: [],
        type: 3,
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
      }
    }
  }
</script>

<style lang="less">
  #tbgan {
    width: 100%;
    height: 100%;
  }
</style>
