<template lang="pug">
  #namelistNotice.wrapper-content
    c-header.wrapper-namelistNotice-header(:menuNames="menuNames")
      .goback(slot='right')
        img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    .wrapper-namelistNotice-content
      .wrapper-namelistNotice-middle
        header
          ul.counts
            li.count
              | 共计：{{ notice.all }}人
            li.count
              | 已回复：{{ notice.allRead }}人
            li.count
              | 未回复：{{ notice.all - notice.allRead }}人
          .filter
            | 筛选
            .select
              el-select(v-model="searchType", @change="searchTypeSelect")
                el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
            .btn.btn-export(@click="exportUserList")
              | 导出名单
        .notices
          el-table(:data='tableData', :border="true", row-class-name="notices-row")
            el-table-column(label-class-name='notices-header', align='center', width="77", prop='number', label='序号', fixed="left")
            el-table-column(label-class-name='notices-header', align='center', min-width="277", prop='unit', label='单位')
            el-table-column(label-class-name='notices-header', align='center', width="160", prop='name', label='姓名')
            el-table-column(label-class-name='notices-header', align='center', width="160", prop='job', label='工会职务')
            el-table-column(label-class-name='notices-header', align='center', width="160", prop='phone', label='电话')
            el-table-column(label-class-name='notices-header', align='center', max-width="300", prop='status', label='状态')
        .bar-page
          c-page(:callBack="loadData")
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CPage from '../../common/page/cPage.vue'
  import { bindTableWhellEvent, fixedHeight } from '../../../core/utils/event'
  import filters from '../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  import { LocalStorage } from '../../../core/localstorage/util'

  let noticeId = ''

  export default {
    name: 'namelistPublic',
    components: {
      CHeader,
      CPage
    },
    beforeRouteEnter (to, from, next) {
      noticeId = to.params.publicId
      next()
    },
    data () {
      return {
        notice: {},
        currentPage: 1,
        menuNames: [
          {
            name: '通知反馈名单',
            route: '',
            on: true
          }
        ],
        searchOptions: [
          {
            value: '-1',
            label: '全部'
          }
        ],
        searchType: '-1',
        tableData: []
      }
    },
    created () {
      this.resetPage()
      this.$set(this.notice, 'noticeId', noticeId)
      this.loadData()
      this.getCopySet()
      this.initReplyCount(noticeId)
//      this.notice = LocalStorage.getLocalData()[LocalStorage.NOTICE]
    },
    destroyed () {
      LocalStorage.clearLocalData(LocalStorage.NOTICE)
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
      ...mapActions(['resetPage', 'loadReceivedListUser', 'loadGetCopySet', 'loadExportUserList', 'loadReplyCount', 'goBack']),
      loadData () {
        this.notice.noticeId = noticeId
        let keyParam = this.notice
        this.loadReceivedListUser(keyParam).then((data) => {
          let list = []
          let number = 1
          for (let item of data.list) {
            let o = {
              'number': number++,
              'unit': item.deptName,
              'name': item.name,
              'job': this.positionTypeFilter(item.positionType),
              'phone': item.mobile,
              'status': this.getStatus(item.readType, item.reply)
            }
            list.push(o)
          }
          this.tableData = list
          this.getPage.total = data.total
        })
      },
      getStatus (readType, reply) {
        if (readType === 0) {
          return this.readtypeFilter(readType)
        } else {
          for (let item of this.searchOptions) {
            if (item.value === reply.toString()) {
              return item.label
            }
          }
        }
      },
      getCopySet () {
        this.loadGetCopySet(this.notice.noticeId).then((data) => {
          for (let item of data) {
            let o = {
              value: item.copyContentId,
              label: item.copyContent
            }
            this.searchOptions.push(o)
          }
        })
      },
      handleSeach () {
        if (this.searchType === '0') {
          return
        }
        this.loadData()
      },
      receiveTimeChange (data) {
        this.loadData()
      },
      searchTypeSelect (data) {
        this.searchType = data
        if (data === '-1') {
          this.notice.noticeCopies = null
        } else {
          this.notice.noticeCopies = [{'copyContentId': data}]
        }
        this.loadData()
      },
      exportUserList () {
        const newTab = window.open('about:blank')
        this.loadExportUserList(this.notice).then((url) => {
          newTab.location.href = url
        })
      },
      initReplyCount (noticeId) {
        this.loadReplyCount(noticeId).then((data) => {
          this.notice = data
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../../common/less/common";

  .el-scrollbar {
    .el-select-dropdown__wrap {
      overflow: hidden;
    }
  }

  #namelistNotice {
    width: 100%;
    height: 100%;

    .wrapper-namelistNotice-header {
      .toolbar {
        height: 60px;
        .icon-back {
          margin-top: 17px;
          margin-right: 80px;
          cursor: pointer;
          img {
            width: 28px;
            height: 28px;
          }
        }
      }
    }
    .wrapper-namelistNotice-content {
      padding: 17px 20px;
      padding-bottom: 0;
      width: 100%;
      height: calc(~"100% - 77px");
      box-sizing: border-box;
      overflow-y: auto;
      .wrapper-namelistNotice-middle {
        width: 100%;
        padding: 15px 25px 70px 25px;
        box-sizing: border-box;
        background-color: #ffffff;
        header {
          height: 70px;
          color: #9AA1AE;
          font-size: 14px;
          padding: 20px 0;
          line-height: 30px;
          box-sizing: border-box;
          .counts {
            float: left;
            margin-left: 5px;
            .count {
              float: left;
              margin-right: 40px;
              &:last-child {
                margin-right: 0;
              }
            }
          }
          .filter {
            float: right;
            .select, .btn-export {
              display: inline-block;
            }
            .select {
              margin-left: 15px;
              margin-right: 25px;
              height: 30px;
              .el-select {
                width: 264px;
                .el-input {
                  width: 264px;
                  color: #9AA1AE;
                }
              }
              .el-input__inner {
                background-color: #F7F8FA;
                border: 0;
                outline: none;
                height: 30px;
              }
            }
            .btn-export {
              margin-left: 25px;
              margin-right: 20px;
            }
          }
        }
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
