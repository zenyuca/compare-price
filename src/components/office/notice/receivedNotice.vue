<template lang="pug">
  #receivedNotice.wrapper-content
    c-header.wrapper-receivedNotice-header(:menuNames="menuNames")
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
    name: 'receivedNotice',
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
        showTip: false,
        badgeCount: 0,
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
        currentMsg: {},
        // 组件对象
        cOfficeList: {}
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
      ...mapGetters(['getAccount', 'getPage', 'getMenus', 'getShareData'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'loadReceivedNotices', 'loadReadNotices', 'loadReadCount', 'loadFindMsg', 'loadReplyMsg', 'loadReplyMembers']),
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
            this.cOfficeList.setNotices(this.notices, this.loadData)
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
          from: item.deptName,
          name: item.name,
          attachments: item.fileList,
          title: item.title,
          content: item.content,
          msgStatus: item.msgStatus,
          replys: _this.assembleReplys(item.noticeCopies),
          reply: item.reply,
          currentReplyId: '',
          currentReply: '',
          currentTab: 1,
          createBy: item.createBy,
          dataType: 0
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
      reply (notice, _this = this) {
        if (notice.currentReplyId === '') {
          this.$alert('请选择回复项', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
          return
        }
        let o = {
          noticeId: notice.noticeId,
          readType: 1,
          reply: notice.currentReplyId,
          type: 0
        }
        notice.oldStatus = notice.status
        _this.loadReadNotices(o).then((data) => {
          notice.status = '已处理'
          if (notice.oldStatus !== notice.status) {
            _this.getShareData.unReadCount.notice.value -= 1
          }
          notice.reply = notice.currentReplyId
          _this._initReply(notice, notice.replys)
          _this.setUnReadCount(notice.noticeId)
        })
      },
      replyEdit (notice) {
        notice.currentReply = ''
      }
    }
  }
</script>
<style lang="less">
  @import "../../common/less/common";

  #receivedNotice {
    width: 100%;
    height: 100%;

  }
</style>
