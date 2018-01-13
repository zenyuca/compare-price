<template lang="pug">
  #manageNotice.wrapper-content
    c-header.wrapper-manageNotice-header(:menuNames="menuNames")
      .toolbar(slot="right")
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
        .receiveTime
          el-date-picker(v-model='receiveDateRange', type='daterange', align='right', placeholder='发布日期范围', :picker-options='pickerOptions',@change="receiveTimeChange")
    .wrapper-manageNotice-content
      .wrapper-manageNotice-middle
        .notices
          el-table(:data='tableData', :border="true", row-class-name="notices-row")
            el-table-column(label-class-name='notices-header', align='center', width="77", prop='number', label='序号', fixed="left")
            el-table-column(label-class-name='notices-header', align='center', max-width="300", prop='title', label='标题')
            el-table-column(label-class-name='notices-header', align='center', width="200", prop='unit', label='发布单位')
            el-table-column(label-class-name='notices-header', align='center', width="180", prop='publisher', label='发布人')
            el-table-column(label-class-name='notices-header', align='center', width="160", prop='job', label='工会职务')
            el-table-column(label-class-name='notices-header', align='center', width="200", prop='date', label='发布时间')
            el-table-column(label-class-name='notices-header', align='center', width="297", label='操作', fixed="right")
              template(slot-scope='scope')
                el-button.btn-edit(type='text', size='small',@click="edit(scope.row.noticeId)")
                  | 查看编辑
                el-button.btn-contacts(type='text', size='small',@click="lookNameList(scope.row.noticeId)")
                  | 回复名单
                el-button.btn-del(type='text', size='small',@click="deleted(scope.row.noticeId)")
                  | 删除
        .bar-page
          c-page(:callBack="loadData")
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CPage from '../../common/page/cPage.vue'
  import { bindTableWhellEvent, fixedHeight } from '../../../core/utils/event'
  import filters from '../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  import config from '../common/config'

  export default {
    name: 'managePublic',
    components: {
      CHeader,
      CPage
    },
    data () {
      return {
        ...config,
        currentPage: 1,
        menuNames: [
          {
            name: '通知管理',
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
            label: '标题'
          },
          {
            value: '3',
            label: '发布单位'
          },
          {
            value: '4',
            label: '发布人'
          },
          {
            value: '5',
            label: '工会职务'
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
      ...mapActions(['resetPage', 'loadChildenNotices', 'deletedNotices']),
      loadData () {
        let keyParam = {
          type: 1,
          'searchType': this.searchType,
          'title': this.searchText,
          'content': this.searchText,
          'startTime': this.receiveDateRange[0],
          'endTime': this.receiveDateRange[1]
        }
        this.loadChildenNotices(keyParam).then((data) => {
          this.getPage.total = data.total
          let list = []
          let i = 1
          for (let item of data.list) {
            let o = {
              number: i++,
              noticeId: item.id,
              title: item.title,
              unit: item.deptName,
              publisher: item.name,
              job: this.positionTypeFilter(item.positionType),
              date: new Date(item.createTime).Format('yyyy-MM-dd hh:mm')
            }
            list.push(o)
          }
          this.tableData = list
          this.getPage.total = data.total
        })
      },
      // 在 this.notices 有数据时调用
      _calcNoticesWidth () {
        let width = 0
        width = this.notices.length * 320
        width -= 20
        this.$refs['e-notices'].style.width = width + 'px'
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
      },
      lookNameList (noticeId) {
        this.$router.push(`namelist/${noticeId}`)
      },
      deleted (noticeId) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let notice = {
            noticeId: noticeId,
            type: 1
          }
          this.deletedNotices(notice).then((data) => {
            this.loadData()
          })
        }).catch(() => {
        })
      },
      edit (noticeId) {
        this.$router.push(`create/${noticeId}`)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/less/common";

  #manageNotice {
    width: 100%;
    height: 100%;

    .wrapper-manageNotice-content {
      width: 100%;
      height: calc(~"100% - 77px");
      box-sizing: border-box;
      overflow-y: auto;
      .wrapper-manageNotice-middle {
        margin: 20px;
        width: calc(~"100% - 40px");
        padding: 25px;
        box-sizing: border-box;
        background-color: #ffffff;
        .notices {
          font-size: 14px;
          .notices-row {
            color: #5B5B5B;
          }
          .notices-header {
            color: #9AA1AE;
            background-color: #FAFAFA;
            font-weight: normal;
            border: none;
          }
          .btn-edit, .btn-contacts {
            color: #477CBE;
            &:hover {
              color: #3C689F;
            }
          }
          .btn-del {
            color: #F64D4D;
            &:hover {
              color: #c31c1c;
            }
          }
          .btn-contacts, .btn-del {
            margin-left: 25px;
          }
          // 设置 table 下每一个格子内容超出时显示省略号
          .el-table__body {
            .cell {
              .ellipsis-mixin
            }
          }
        }
        .bar-page {
          margin-top: 50px;
        }
      }
    }
  }
</style>
