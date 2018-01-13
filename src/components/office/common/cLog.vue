<template lang="pug">
  #log.wrapper-content
    c-header.wrapper-log-header(:menuNames="menuNames")
      .toolbar(slot="right")
        .log-type
          | 日志类型：
          el-select(v-model="action", @change="searchActionSelect")
            el-option(v-for="item in searchTypeOptions", :key="item.value", :label="item.label", :value="item.value")
        .receiveTime
          el-date-picker(v-model='receiveDateRange', type='daterange', align='right', placeholder='操作日期范围', :picker-options='pickerOptions',@change="receiveTimeChange")
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
    .wrapper-log-content
      .wrapper-log-middle
        .notices
          el-table(:data='tableData', :border="true", row-class-name="notices-row")
            el-table-column(label-class-name='notices-header', align='center', width="77", prop='number', label='序号', fixed="left")
            el-table-column(label-class-name='notices-header', align='center', prop='action', label='行为')
            el-table-column(label-class-name='notices-header', align='center', prop='createBy', label='操作人名字')
            el-table-column(label-class-name='notices-header', align='center', prop='deptName', label='所属工会')
            el-table-column(label-class-name='notices-header', align='center', prop='createTime', label='操作时间')
        .bar-page
          c-page(:callBack="loadData")
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CPage from '../../common/page/cPage.vue'
  import { mapGetters, mapActions } from 'vuex'
  import filters from '../../../core/filters'
  import config from './config'

  export default {
    name: 'log',
    components: {
      CHeader,
      CPage
    },
    props: {
      // 日志类型
      logType: {
        type: String,
        default: '0'
      }
    },
    data () {
      return {
        ...config,
        menuNames: [
          {
            name: '管理日志',
            route: '',
            on: true
          }
        ],
        action: '',
        searchType: '0',
        searchText: '',
        receiveDateRange: '',
        searchOptions: [
          {
            value: '0',
            label: '请选择'
          },
          {
            value: '1',
            label: '操作人名字'
          },
          {
            value: '2',
            label: '所属工会'
          }
        ],
        searchTypeOptions: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: '0',
            label: '增加'
          },
          {
            value: '1',
            label: '删除'
          }
        ],
        tableData: []
      }
    },
    created () {
      this.resetPage()
      this.loadData()
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'loadLogs']),
      loadData () {
        let keyParam = {
          'action': this.action,
          'searchType': this.searchType,
          'searchText': this.searchText,
          'start': this.receiveDateRange[0],
          'end': this.receiveDateRange[1],
          'type': this.logType
        }
        this.loadLogs(keyParam).then((data) => {
          this.getPage.total = data.total
          let list = []
          let i = 1
          for (let item of data.list) {
            let o = {
              number: i++,
              logId: item.id,
              action: this.actionTypeFilter(item.action),
              createBy: item.createBy,
              deptName: item.deptName,
              createTime: new Date(item.createTime).Format('yyyy-MM-dd hh:mm')
            }
            list.push(o)
          }
          this.tableData = list
          this.getPage.total = data.total
        })
      },
      receiveTimeChange (data) {
        this.loadData()
      },
      searchActionSelect (data) {
        this.action = data
        this.loadData()
      },
      searchTypeSelect (data) {
        this.searchType = data
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  #log {
    width: 100%;
    height: 100%;

    .wrapper-log-header {
      .toolbar {
        .searcher {
          width: 358px;
          .el-select {
            width: 120px !important;
          }
        }
      }
    }
    .wrapper-log-content {
      width: 100%;
      height: calc(~"100% - 77px");
      box-sizing: border-box;
      overflow-y: auto;
      .wrapper-log-middle {
        margin: 20px;
        width: calc(~"100% - 40px");
        padding: 25px;
        box-sizing: border-box;
        background-color: #ffffff;
        .bar-page {
          margin-top: 50px;
        }
      }
    }
  }
</style>
