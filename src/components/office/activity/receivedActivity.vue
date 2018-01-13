<template lang="pug">
  #receivedActivity.wrapper-content
    c-header.wrapper-receivedActivity-header(:menuNames="menuNames")
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
        .status(:class="{'over': props.notice.status === '未开始','joining': props.notice.status === '报名中','actioning': props.notice.status === '进行中','over': props.notice.status === '已结束'}")
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
        footer.activity-info
          .rows
            .row
              img.icon(src="../common/icon/icon-peoples.png")
              .value
                | {{ props.notice.current }}/{{ props.notice.total }}人
            .row
              img.icon(src="../common/icon/icon-time.png")
              .value
                | {{ props.notice.start }} — {{ props.notice.end }}
            .row
              img.icon(src="../common/icon/icon-address.png")
              .value
                | {{ props.notice.place }}
          .btn-bar
            .btn(:class="{'btn-join': props.notice.signUpStatus === 0,'btn-cancel': props.notice.signUpStatus === 1,'btn-over': props.notice.status === '进行中'}",@click="signUp(props.notice)")
              | {{signUpType(props.notice.signUpStatus)}}
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import COfficeList from '../common/cOfficeList.vue'
  import CAttachmentList from '../common/cAttachmentList.vue'
  import filters from '../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  import config from '../common/config'

  export default {
    name: 'receivedActivity',
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
        menuID: 'activity/received',
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
        activitys: [],
        currentActivity: {},
        currentMsg: {}
      }
    },
    watch: {
      activitys: {
        handler: function (val, oldVal) {
          for (let item of val) {
            if (item.atContent && item.replyMessageContent === item.atContent.slice(0, -1)) {
              this._clearAtInfo(item)
            }
          }
        },
        deep: true
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
      ...mapActions(['resetPage', 'loadReceivedActivity', 'loadReadMeetings', 'loadReadCount', 'loadSignUpActivity', 'loadCancelSignUpActivity']),
      setNotices (list) {
        this.cOfficeList.setNotices(list, null, 1)
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
          'searchType': this.searchType,
          'title': this.searchText,
          'content': this.searchText,
          'start': this.receiveDateRange[0],
          'end': this.receiveDateRange[1],
          'readtype': readtype
        }
        this.loadReceivedActivity(keyParam).then((data) => {
          this.getPage.hasNextPage = data.total !== this.activitys.length
          this.getPage.page += 1
          for (let item of data.list) {
            let o = this.transferData(item)
            this.activitys.push(o)
          }
          this.$nextTick(() => {
            this.cOfficeList.setNotices(this.activitys, this.loadData, 1)
            e.loading = false
          })
        })
      },
      // 将服务器数据格式转换成页面数据格式
      transferData (item, _this = this) {
        let o = {
          activityId: item.id,
          noticeId: item.id,
          day: _this.dateTodayFilter(item.created),
          time: _this.dateTodayFilter(item.created),
          type: '内部活动',
          status: _this.activityTypeFilter(item.status),
          from: item.deptName,
          name: item.adminName,
          attachments: item.files,
          title: item.name,
          content: item.detail,
          current: item.current,
          msgStatus: item.msgStatus,
          total: item.total,
          currentTab: 1,
          createBy: item.createBy,
          start: new Date(item.start).Format('MM月dd日 hh:mm'),
          end: new Date(item.end).Format('MM月dd日 hh:mm'),
          place: item.place,
          signUpStatus: item.signUpStatus,
          dataType: 2
        }
        return o
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
        this.activitys = []
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
      signUp (activity) {
        if (activity.signUpStatus === 0) {
          this.loadSignUpActivity(activity.activityId).then((data) => {
            activity.signUpStatus = 1
            activity.current = activity.current + 1
          }).catch((data) => {
            this.$alert(data.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          })
        } else if (activity.signUpStatus === 1) {
          this.loadCancelSignUpActivity(activity.activityId).then((data) => {
            activity.signUpStatus = 0
            activity.current = activity.current - 1
          }).catch((data) => {
            this.$alert(data.msg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          })
        }
      },
      signUpType (type) {
        if (type === 0) {
          return '报名参加'
        } else if (type === 1) {
          return '取消报名'
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/less/common";

  #receivedActivity {
    width: 100%;
    height: 100%;

    .activity-info {
      height: 166px;
      border-top: 1px solid #E6E9ED;
      background-color: #F7F8FA;
      .rows {
        .row {
          line-height: 14px;
          margin-top: 15px;
          &:last-child {
            margin-bottom: 15px;
          }
          .icon, .value {
            display: inline-block;
            font-size: 14px;
            color: #9AA1AE;
          }
          .icon {
            vertical-align: top;
            margin-right: 12px;
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
