article
<template lang="pug">
  #receivedAffiche.wrapper-content
    c-header.wrapper-receivedAffiche-header(:menuNames="menuNames")
      .toolbar(slot="right", v-if="!isPreprocess")
        .wrapper-status
          el-checkbox.status-1(@change="checkboxChange",v-model="deal")
            | 未处理
          el-checkbox(@change="checkboxChange",v-model="noDeal")
            | 已处理
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
        .receiveTime
          el-date-picker(v-model='receiveDateRange', type='daterange', align='right', placeholder='接收日期范围', :picker-options='pickerOptions',@change="receiveTimeChange")
    c-office-list(ref="c-office-list")
      template(slot="status", slot-scope="props")
        .status
          .read.btn(:class="{'on': props.notice.status === '未处理'}", @click="setStatus(props.notice, 0)")
            | 未读
          .unread.btn(:class="{'on': props.notice.status === '已处理'}", @click="setStatus(props.notice, 1)")
            | 已读
      template(slot="panel1", slot-scope="props")
        article
          .title
            | {{ props.notice.title }}
          .from
            .dept
              | 发起人：{{ props.notice.from }}
            .name
              | {{ props.notice.name }}
          .content(v-html="props.notice.content")
          c-attachment-list(v-if="props.notice.attachments", :attachments="props.notice.attachments")
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import COfficeList from '../common/cOfficeList.vue'
  import CAttachmentList from '../common/cAttachmentList.vue'
  import filters from '../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  import config from '../common/config'

  export default {
    name: 'receivedPublic',
    components: {
      CHeader,
      COfficeList,
      CAttachmentList
    },
    props: {
      isPreprocess: {
        type: Boolean,
        defualt () {
          return false
        }
      }
    },
    data () {
      return {
        ...config,
        badgeCount: 0,
        menuID: 'notice/received',
        menuNames: [
          {
            name: '我收到的',
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
            value: '2',
            label: '内容'
          }
        ],
        searchType: '0',
        searchText: '',
        receiveDateRange: '',
        deal: false,
        noDeal: false,
        notices: [],
        currentNotice: {},
        currentMsg: {}
      }
    },
    created () {
    },
    mounted () {
      this.cOfficeList = this.$refs['c-office-list']
      if (!this.isPreprocess) {
        this.resetPage()
        this.loadData()
      }
    },
    destroyed () {
    },
    computed: {
      ...mapGetters(['getPage', 'getMenus', 'getShareData'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'loadReceivedNotices', 'loadReadNotices', 'loadReadCount']),
      setNotices (list) {
        this.cOfficeList.setNotices(list, null, 2)
      },
      loadData (e = {}) {
        if (!this.getPage.hasNextPage) {
          e.loading = false
          return
        }
        e.loading = true
        let readtype
        if (this.deal && this.noDeal) {
          readtype = null
        } else if (this.deal) {
          readtype = 0
        } else if (this.noDeal) {
          readtype = 1
        }
        let keyParam = {
          type: 1,
          'searchType': this.searchType,
          'title': this.searchText,
          'content': this.searchText,
          'startTime': this.receiveDateRange[0],
          'endTime': this.receiveDateRange[1],
          'readtype': readtype
        }
        this.loadReceivedNotices(keyParam).then((data) => {
          this.getPage.hasNextPage = data.total !== this.notices.length
          this.getPage.page += 1
          for (let item of data.list) {
            let o = this.transferData(item)
            this._initReply(o, o.replys)
            this.notices.push(o)
          }
          this.$nextTick(() => {
            this.cOfficeList.setNotices(this.notices, this.loadData, 2)
            e.loading = false
          })
        })
      },
      // 将服务器数据格式转换成页面数据格式
      transferData (item, _this = this) {
        let o = {
          noticeId: item.id,
          day: _this.dateTodayFilter(item.createTime),
          time: _this.dateTodayFilter(item.createTime),
          type: _this.noticeTypeFilter(item.type),
          status: _this.readtypeFilter(item.readtype),
          readType: item.readtype,
          from: item.deptName,
          name: item.name,
          attachments: item.fileList,
          title: item.title,
          content: item.content,
          replys: _this.assembleReplys(item.noticeCopies),
          reply: item.reply,
          currentReplyId: '',
          currentReply: '',
          currentTab: 1,
          createBy: item.createBy
        }
        return o
      },
      _initReply (notice, replys) {
        for (let item of replys) {
          if (item.id === notice.reply) {
            notice.currentReply = item
            return
          }
        }
      },
      assembleReplys (data) {
        let list = []
        for (let item of data) {
          let o = {
            id: item.copyContentId,
            name: item.copyContent,
            selected: false
          }
          list.push(o)
        }
        return list
      },
      searchTypeSelect (data) {
        this.searchType = data
      },
      handleSeach () {
        this.resetChangePage()
        this.loadData()
      },
      resetChangePage () {
        this.getPage.page = 1
        this.notices = []
        this.getPage.hasNextPage = true
      },
      receiveTimeChange (data) {
        this.resetChangePage()
        this.loadData()
      },
      checkboxChange () {
        this.resetChangePage()
        this.loadData()
      },
      setStatus (notice, readType) {
        if (notice.readType === readType) {
          return
        }
        let param = {
          noticeId: notice.noticeId,
          readType
        }
        this.loadReadNotices(param).then((data) => {
          notice.status = this.readtypeFilter(readType)
          notice.readType = data.readType
          let i = 1
          if (readType === 1) {
            i = -1
          }
          this.getShareData.unReadCount.affiche.value += i
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/less/common";

  .el-scrollbar {
    .el-select-dropdown__wrap {
      overflow: hidden;
    }
  }

  #receivedAffiche {
    width: 100%;
    height: 100%;

    .status {
      font-size: 12px;
      float: right;
      background-color: #E6E9ED;
      border-radius: 12px;
      margin-top: 15px;
      padding: 0;
      color: #B0B0B0;
      display: inline-block;
      box-sizing: border-box;
      .read, .unread {
        width: 47px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        display: inline-block;
        border-radius: 12px;
      }
      .read {
        &.on {
          background-color: #FB9926;
          color: #ffffff;
        }
      }
      .unread {
        &.on {
          background-color: #ffffff;
          color: #FB9926;
        }
      }
    }
    .panel-1 {
      article {
        top: 52px;
        bottom: 0;
      }
    }
  }
</style>
