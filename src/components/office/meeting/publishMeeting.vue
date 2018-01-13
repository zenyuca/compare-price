<template lang="pug">
  #publishMeeting.wrapper-content
    c-header.wrapper-publishMeeting-header(:menuNames="menuNames")
      .toolbar(slot="right")
        .searcher
          .select
            el-select(v-model="searchType", @change="searchTypeSelect")
              el-option(v-for="item in searchOptions", :key="item.value", :label="item.label", :value="item.value")
          .input
            el-input(placeholder="搜索", icon="search", v-model="searchText", :on-icon-click="handleSeach")
        .receiveTime
          el-date-picker(v-model='receiveDateRange', type='daterange', align='right', placeholder='发布日期范围', :picker-options='pickerOptions',@change="receiveTimeChange")
        .wrapper-create(@click="createMeeting")
          i.icon
          span.name
            | 创建会议
    c-office-list(ref="c-office-list")
      template(slot="status", slot-scope="props")
        img.btn.btn-edit(src="../common/icon/icon-edit.png",@click="edit(props.notice.noticeId)")
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
  import { LocalStorage } from '../../../core/localstorage/util'
  import config from '../common/config'

  export default {
    name: 'publishMeeting',
    components: {
      CHeader,
      COfficeList,
      CAttachmentList
    },
    data () {
      return {
        ...config,
        menuNames: [
          {
            name: '我发布的',
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
        meetings: [],
        isLoading: false
      }
    },
    created () {
      this.resetPage()
      this.loadData()
    },
    mounted () {
      this.cOfficeList = this.$refs['c-office-list']
    },
    destroyed () {
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'loadPublishMeeting', 'loadFindMsg', 'loadReplyMsg', 'loadReplyMembers', 'loadMemberDetail']),
      loadData (e = {}) {
        if (!this.getPage.hasNextPage) {
          e.loading = false
          return
        }
        e.loading = true
        let keyParam = {
          type: 0,
          'searchType': this.searchType,
          'title': this.searchText,
          'content': this.searchText,
          'start': this.receiveDateRange[0],
          'end': this.receiveDateRange[1]
        }
        this.loadPublishMeeting(keyParam).then((data) => {
          this.getPage.hasNextPage = data.hasNextPage
          this.getPage.page += 1
          for (let item of data.list) {
            let o = {
              noticeId: item.id,
              day: this.dateTodayFilter(item.created),
              time: this.dateTodayFilter(item.created),
              type: this.noticeTypeFilter(item.type),
              from: item.deptName,
              name: item.name,
              msgStatus: item.crtMsgStatus,
              attachments: item.fileList,
              title: item.title,
              content: item.content,
              all: item.all,
              allRead: item.allRead,
              currentTab: 1,
              dataType: 3
            }
            this.meetings.push(o)
          }
          this.$nextTick(() => {
            this.cOfficeList.setNotices(this.meetings, this.loadData)
            e.loading = false
          })
        })
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
      resetChangePage () {
        this.getPage.page = 1
        this.meetings = []
        this.getPage.hasNextPage = true
      },
      handleSeach () {
        this.resetChangePage()
        this.loadData()
      },
      receiveTimeChange (data) {
        this.resetChangePage()
        this.loadData()
      },
      searchTypeSelect (data) {
        this.searchType = data
      },
      lookNameList (meeting) {
        LocalStorage.storeLocalData(LocalStorage.NOTICE, meeting)
        this.$router.push(`namelist/${meeting.noticeId}`)
      },
      createMeeting () {
        this.$router.push(`create`)
      },
      lookEdit (meeting) {
        this.$router.push(`create/${meeting.noticeId}`)
      },
      changeTab (meeting, tab) {
        if (tab === 2) {
          this.getLeaveWord(meeting)
        } else if (tab === 3) {
          this.getMembers(meeting)
        } else {
          meeting.currentTab = tab
        }
      },
      getMembers (meeting) {
        this.loadReplyMembers(meeting.noticeId).then((data) => {
          for (let item of data) {
            for (let user of item.users) {
              if (!user.headimgurl) {
                user.headimgurl = '/static/image/avatar-girl.jpg'
              }
            }
          }
          this.$set(meeting, 'members', data)
          meeting.currentTab = 3
        })
      },
      getLeaveWord (meeting) {
        this.loadFindMsg(meeting.noticeId).then((data) => {
          this.$set(meeting, 'msgs', data.list)
          this.$set(meeting, 'inputing', false)
          this.$set(meeting, 'memberDetailShow', false)
          meeting.currentTab = 2
          this.currentMeeting = meeting
          this.$set(meeting, 'replyMessageContent', '')
        })
      },
      replyMsg (meeting, msg) {
        meeting.currentMsg = msg
        let input = document.getElementById(`input-comment-reply-${meeting.noticeId}`)
        input.focus()
        let atContent = `@${msg.createByName} `
        meeting.replyMessageContent = atContent
        meeting.atContent = atContent
      },
      doReply (meeting) {
        let msg = {}
        if (meeting.atContent) {
          let atLength = meeting.atContent.length
          let message = meeting.replyMessageContent.substring(atLength)
          msg = {
            message,
            parentId: meeting.currentMsg.parentId,
            userId: meeting.currentMsg.createBy,
            userName: meeting.currentMsg.createByName,
            noticeId: meeting.noticeId
          }
          if (!msg.parentId) {
            msg.parentId = meeting.currentMsg.id
          }
        } else {
          let message = meeting.replyMessageContent
          msg = {
            message,
            noticeId: meeting.noticeId
          }
        }
        if (msg.message) {
          this.loadReplyMsg(msg).then((data) => {
            if (meeting.atContent) {
              for (let item of meeting.msgs) {
                if (item.id === data.parentId) {
                  if (!item.noticeMsgs) {
                    item.noticeMsgs = []
                  }
                  item.noticeMsgs.splice(0, 0, data)
                }
              }
            } else {
              if (!meeting.msgs) {
                meeting.msgs = []
              }
              meeting.msgs.splice(0, 0, data)
            }
            this.$nextTick(() => {
              this._toPosition(meeting, data.parentId)
            })
            this._clearAtInfo(meeting)
          })
        } else {
          this.$alert('请填写回复内容', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
        }
      },
      _clearAtInfo (meeting) {
        meeting.replyMessageContent = ''
        meeting.atContent = ''
      },
      edit (noticeId) {
        this.$router.push(`create/${noticeId}`)
      }
    }
  }
</script>

<style lang="less">
  @import "../../common/less/common";

  #publishMeeting {
    width: 100%;
    height: 100%;
    .btn-edit {
      float: right;
      margin-top: 16px;
    }
    .panel-1 {
      article {
        bottom: 0;
      }
    }
  }
</style>
