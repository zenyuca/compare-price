<template lang="pug">
  #receivedMeeting.wrapper-content
    c-header.wrapper-receivedMeeting-header(:menuNames="menuNames")
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
        .status(:class="{'on': props.notice.status === '已处理'}")
          | {{ props.notice.status }}
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
        footer
          .activity-info
            .rows
              .row
                .icon
                  img(src="../common/icon/icon-time.png")
                .value
                  | 12月03日 10:30 — 12月04日 12:00
              .row
                .icon
                  img(src="../common/icon/icon-address.png")
                .value(:title="props.notice.address")
                  | {{props.notice.address}}
          .noReply(v-if="!props.notice.currentReply")
            el-select(v-model="props.notice.currentReplyId", change="changeReply()")
              el-option(v-for="item in props.notice.replys", :key="item.id", :label="item.name", :value="item.id")
            .btn.btn-base(@click="reply(props.notice)")
              | 回复
          .hasReply(v-if="props.notice.currentReply")
            .reply-name
              | 回复：
            span
              | {{ props.notice.currentReply.name }}
            .btn.btn-edit(@click="replyEdit(props.notice)")
              | 修改
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import COfficeList from '../common/cOfficeList.vue'
  import CAttachmentList from '../common/cAttachmentList.vue'
  import filters from '../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  import config from '../common/config'

  export default {
    name: 'receivedMeeting',
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
        menuID: 'meeting/received',
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
        meetings: [],
        currentMeeting: {},
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
      ...mapActions(['resetPage', 'loadReceivedMeeting', 'loadReadMeetings', 'loadReadCount', 'loadFindMsg', 'loadReplyMsg', 'loadReplyMembers', 'loadMemberDetail']),
      setNotices (list) {
        this.cOfficeList.setNotices(list)
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
          type: 0,
          'searchType': this.searchType,
          'title': this.searchText,
          'content': this.searchText,
          'start': this.receiveDateRange[0],
          'end': this.receiveDateRange[1],
          'readtype': readtype
        }
        this.loadReceivedMeeting(keyParam).then((data) => {
          this.getPage.hasNextPage = data.total !== this.meetings.length
          this.getPage.page += 1
          for (let item of data.list) {
            let o = this.transferData(item)
            this._initReply(o, o.replys)
            this.meetings.push(o)
          }
          this.$nextTick(() => {
            this.cOfficeList.setNotices(this.meetings, this.loadData)
            e.loading = false
          })
        })
      },
      // 将服务器数据格式转换成页面数据格式
      transferData (item, _this = this) {
        let o = {
          noticeId: item.id,
          day: _this.dateTodayFilter(item.created),
          time: _this.dateTodayFilter(item.created),
          type: '内部会议',
          status: _this.readtypeFilter(item.readtype),
          from: item.deptName,
          name: item.name,
          msgStatus: item.msgStatus,
          attachments: item.fileList,
          title: item.title,
          content: item.content,
          replys: _this.assembleReplys(item.noticeCopies),
          reply: item.reply,
          currentReplyId: '',
          currentReply: '',
          currentTab: 1,
          createBy: item.createBy,
          address: item.address,
          dataType: 3
        }
        return o
      },
      _initReply (meeting, replys) {
        for (let item of replys) {
          if (item.id === meeting.reply) {
            meeting.currentReply = item
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
      /**
       * 更新我收到的而没有回复的数量
       * 然后同步到菜单显示栏
       * @private
       */
      _updateBadgeCount () {
        for (let item of this.getMenus.menus3) {
          if (item.id === this.menuID) {
            item.badge = {
              value: this.badgeCount
            }
          }
        }
      },
      loadBadgeCount () {
        this.loadReadCount(0).then((data) => {
          this.badgeCount = data
          this.getShareData.unReadCount.meeting = data
          this._updateBadgeCount()
        })
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
        this.meetings = []
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
      reply (meeting) {
        if (meeting.currentReplyId === '') {
          this.$alert('请选择回复项', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
          return
        }
        let o = {'noticeId': meeting.noticeId, 'readType': 1, 'reply': meeting.currentReplyId, type: 0}
        this.loadReadMeetings(o).then((data) => {
          this.loadBadgeCount()
          meeting.status = '已处理'
          meeting.reply = meeting.currentReplyId
          this._initReply(meeting, meeting.replys)
        })
      },
      replyEdit (meeting) {
        meeting.currentReply = ''
      }
    }
  }
</script>

<style lang="less">
  @import "../../common/less/common";

  #receivedMeeting {
    width: 100%;
    height: 100%;
    .panel-1 {
      article {
        bottom: 155px;
      }
      footer {
        height: 155px;
      }
      .hasReply {
        /*height: auto;*/
      }
    }
    .panel-2 {
      footer {
        height: 75px;
      }
    }
    .activity-info {
      .rows {
        .row {
          height: 16px;
          line-height: 16px;
          margin-top: 15px;
          font-size: 14px;
          color: #9AA1AE;
          &:last-child {
            margin-bottom: 15px;
          }
          .icon, .value {
            display: inline-block;
          }
          .icon {
            margin-right: 12px;
            height: 16px;
            text-align: center;
            img {
              vertical-align: text-top;
            }
          }
          .value {
            .ellipsis-mixin;
            width: calc(~"100% - 28px");
          }
        }
      }
      .btn-bar {
        height: 64px;
        .btn {
          text-align: center;
          padding: 11px 0;
          box-sizing: border-box;
          // 报名参加
          &.btn-join {
            color: #ffffff;
            background-color: #6DA2E5;
            border: 1px solid;
          }
          // 取消报名
          &.btn-cancel {
            color: #6DA2E5;
            background-color: #FFFFFF;
            border: 1px solid #E6E9ED;
          }
          // 报名结束
          &.btn-over {
            color: #ffffff;
            background-color: #9AA1AE;
            border: 1px solid;
          }
        }
      }
    }

  }
</style>
