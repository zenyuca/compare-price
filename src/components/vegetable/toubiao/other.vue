<template lang="pug">
  #rou
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        import-btn()
        el-button(type="primary", @click="exportExcel", style="margin-right: 40px; width: 180px;")
          | 导出
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .notices
            el-table(:data='tableData', :border="false", row-class-name="notices-row")
              el-table-column(label-class-name='notices-header', align='center', width="77", prop='number', label='序号', fixed="left")
              el-table-column(label-class-name='notices-header', align='center', prop='name', label='红娘姓名')
              el-table-column(label-class-name='notices-header', align='center', prop='sex', label='性别')
              el-table-column(label-class-name='notices-header', align='center', prop='phone', label='联系电话')
              el-table-column(label-class-name='notices-header', align='center', prop='createTime', label='申请时间')
              el-table-column(label-class-name='notices-header', align='center', width="180", label='操作', fixed="right")
                template(slot-scope='scope')
                  el-button.btn-edit(type='text', size='small',@click="edit(scope.row.id)")
                    | 审核
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CPage from '../../common/page/cPage.vue'
  import importBtn from '../common/importBtn'
  import filters from '../../../core/filters/index'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'rou',
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
        tableData: []
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
