<template lang="pug">
  #redgirl-list.wrapper-content
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
        .btn.btn-export
          | 导出
    .wrapper-list-content
      .wrapper-list-middle
        .list
          el-table(:data='tableData', :border="true", row-class-name="notices-row")
            el-table-column(label-class-name='notices-header', align='center', width="77", prop='number', label='序号', fixed="left")
            el-table-column(label-class-name='notices-header', align='center', prop='name', label='发起人姓名')
              template(slot-scope='scope')
                el-button.btn-edit(type='text', size='small', @click="detail(scope.row.name)")
                  | {{ scope.row.name }}
            el-table-column(label-class-name='notices-header', align='center', prop='sex', label='发起人性别')
            el-table-column(label-class-name='notices-header', align='center', prop='sex', label='单身状况')
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='发起人电话')
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='被牵手人姓名')
              template(slot-scope='scope')
                el-button.btn-edit(type='text', size='small', @click="detail(scope.row.name)")
                  | {{ scope.row.name }}
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='被牵手人性别')
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='单身状况')
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='被牵手人电话')
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='红娘姓名')
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='红娘性别')
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='红娘电话')
            el-table-column(label-class-name='notices-header', align='center', prop='phone', label='当前牵手状况')
          .bar-page
            c-page(:callBack="loadData")
</template>

<script>
  import CHeader from '../../../../common/header/cHeader.vue'
  import CPage from '../../../../common/page/cPage.vue'
  import { bindTableWhellEvent, fixedHeight } from '../../../../../core/utils/event'
  import filters from '../../../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'namelistActivity',
    components: {
      CHeader,
      CPage
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    data () {
      return {
        currentPage: 1,
        searchType: '1',
        searchText: '',
        searchOptions: [
          {
            value: '0',
            label: '请选择'
          },
          {
            value: '1',
            label: '姓名'
          },
          {
            value: '2',
            label: '联系电话'
          }
        ],
        menuNames: [
          {
            name: '牵手任务管理',
            route: '',
            on: true
          }
        ],
        tableData: [
          {
            number: 1,
            name: '李湘',
            sex: '女',
            phone: '13454131234',
            idcard: '201124199804211234'
          },
          {
            number: 2,
            name: '李湘',
            sex: '女',
            phone: '13454131234',
            idcard: '201124199804211234'
          }
        ]
      }
    },
    created () {
      this.resetPage()
      this.loadData()
    },
    destroyed () {
    },
    mounted () {
      this.$nextTick(() => {
        bindTableWhellEvent()
        fixedHeight()
      })
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'loadReceivedActivityUser', 'loadExportActivityUser', 'loadReplyCount', 'goBack']),
      loadData () {
      },
      resetChangePage () {
        this.getPage.page = 1
        this.notices = []
        this.getPage.hasNextPage = true
      },
      handleSeach () {
        this.resetChangePage()
        this.loadData()
      },
      searchTypeSelect (data) {
        this.searchType = data
      },
      detail (id) {
        this.$router.push(`hand2hand/detail/${id}`)
      }
    }
  }
</script>

<style lang="less">
  @import "../common/common";
</style>
