<template lang="pug">
  #approve
    c-header(:menuNames="menuNames")
      .toolbar(slot="right")
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .notices
            el-table(:data='tableData', :border="false", row-class-name="notices-row")
              el-table-column(label-class-name='notices-header', align='center', width="77", prop='number', label='序号', fixed="left")
              el-table-column(label-class-name='notices-header', align='center', prop='name', label='红娘姓名')
              el-table-column(label-class-name='notices-header', align='center', prop='success', label='牵线成功')
              el-table-column(label-class-name='notices-header', align='center', prop='doing', label='牵线中')
              el-table-column(label-class-name='notices-header', align='center', prop='wait', label='确认中')
              el-table-column(label-class-name='notices-header', align='center', prop='fail', label='牵线失败')
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
    name: 'approve',
    components: {
      CHeader,
      CPage
    },
    data () {
      return {
        currentPage: 1,
        menuNames: [
          {
            name: '红娘业绩',
            route: '',
            on: true
          }
        ],
        searchOptions: [
          {
            value: '0',
            label: '请选择'
          },
          {
            value: '1',
            label: '红娘姓名'
          }
        ],
        searchType: '0',
        searchText: '',
        receiveDateRange: '',
        tableData: []
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
      ...mapActions(['resetPage', 'findMatcAchieve']),
      loadData () {
        let keyParam = {
          searchType: this.searchType,
          searchText: this.searchText
        }
        console.log(keyParam)
        this.findMatcAchieve(keyParam).then((data) => {
          let list = []
          let i = 0
          for (let item of data.list) {
            i++
            let o = {
              number: i,
              name: item.name,
              success: item.success,
              doing: item.doing,
              wait: item.wait,
              fail: item.fail
            }
            list.push(o)
          }
          this.tableData = list
          this.getPage.total = data.total
        })
      },
      handleSeach () {
        if (this.searchType === '0') {
          this.$alert('请选择搜索类型', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          return
        }
        this.loadData()
      },
      receiveTimeChange (data) {
        this.loadData()
      },
      searchTypeSelect (data) {
        this.searchType = data
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  #approve {
    width: 100%;
    height: 100%;
    .bar-page {
      margin-top: 50px;
    }
  }
</style>
