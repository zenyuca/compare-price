<!-- 办公中我发布的和我收到的统一模板 -->
<template lang="pug">
  .wrapper-content-panel
    .wrapper-notice-notices(ref="e-wrapper-notice-notices", id="e-wrapper-notice-notices")
      ul.notices(ref="e-notices")
        li.notice(v-for="notice in notices")
          .bar-time(@mouseover="addEvent")
            span.time
              | {{ notice.time }}
          .wrapper-notice-content()
            header(@mouseover="addEvent", :class="{'borderBttom1px': type === 2}")
              .type
                | {{ notice.type }}
              slot(name="status", :notice="notice")
            ul.wrapper-tabs(v-if="type !== 2", @mouseover="addEvent")
              li.tab.btn(:class="{'on': notice.currentTab === 1}", @click="changeTab(notice, 1)")
                i.icon-comment-article(:class="{'unSelected': notice.currentTab === 1}")
              li.tab.btn(:class="{'on': notice.currentTab === 2}", @click="changeTab(notice, 2)")
                .unReadFlag(v-if="notice.msgStatus === 0")
                i.icon-comment-rating(:class="{'unSelected': notice.currentTab === 2}")
              li.tab.btn(:class="{'on': notice.currentTab === 3}", @click="changeTab(notice, 3)")
                i.icon-comment-peopels(:class="{'unSelected': notice.currentTab === 3}")
            .panel.panel-1(v-show="notice.currentTab === 1", @mouseover="removeEvent")
              slot(name="panel1", :notice="notice")
            .panel.panel-2(v-show="notice.currentTab === 2", @mouseover="removeEvent")
              article(:id="`comments-${notice.noticeId}`")
                ul.comments
                  li.comment(v-for="msg in notice.msgs", :id="msg.id")
                    .header-comment
                      .wrapper-avatar.btn(:class="{'me': msg.createBy === getAccount.userid}")
                        c-boxtip(:user="msg", :type="1")
                        img.sj(src="./icon/icon-sj-reply.jpg")
                      .name(:class="{'me': msg.createBy === getAccount.userid}")
                        | {{ getEchoName(notice, msg, {}) }}
                    .body-comment
                      .content-comment(:class="{'me': msg.createBy === getAccount.userid}")
                        | {{msg.message}}
                      .footer
                        .time
                          | {{dateTodayFilter(msg.createTime)}}
                        .btn.btn-reply(v-if="msg.createBy !== getAccount.userid")
                          img(src="./icon/icon-reply.png", @click="replyMsg(notice, msg)")
                      ul.ats
                        li.at(v-for="msg2 in msg.noticeMsgs")
                          .wrapper-content-comment
                            c-boxtip(:user="msg2", :type="1")
                            .content-comment
                              .at-name
                                | @{{ getEchoName(notice, {}, msg2) }}：
                              | {{msg2.message}}
                              .footer
                                .time
                                  | {{dateTodayFilter(msg2.createTime)}}
                                .btn.btn-reply(v-if="msg2.createBy !== getAccount.userid")
                                  img(src="./icon/icon-reply.png", @click="replyMsg(notice, msg2)")
              footer
                .input-reply
                  textarea(:class="{'on': notice.inputing}", @focus="notice.inputing = true", @blur="notice.inputing = false", v-model="notice.replyMessageContent", :id="`input-comment-reply-${notice.noticeId}`", placeholder="输入回复内容")
                .btn.btn-base(@click="doReply(notice)")
                  | 回复
            .panel.panel-3(v-show="notice.currentTab === 3", @mouseover="removeEvent")
              article
                ul.members
                  li.member(v-for="member in notice.members")
                    .title-member(v-if="member.users.length > 0")
                      span.left
                      span.middle
                        | {{ member.replyName }}
                      span.right
                    ul.avatars-member(v-if="member.users.length > 0")
                      li.avatar-member(v-for="user in member.users")
                        c-boxtip(:user="user")
                        .name
                          | {{ user.name }}
</template>

<script>
  import CBoxtip from '../../common/boxtip/cBoxtip.vue'
  import filters from '../../../core/filters'
  import { addWhellEvent, removeWhellEvent } from '../../../core/utils/event'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: '',
    components: {
      CBoxtip
    },
    data () {
      return {
        // 1: 会议进来的标记
        // 2: 公告进来的标记
        // 3: 通知进来的标记
        // 4: 活动进来的标记
        type: 0,
        notices: []
      }
    },
    watch: {
      notice: {
        handler: function (val, oldVal) {
          if (val.atContent && val.replyMessageContent === val.atContent.slice(0, -1)) {
            this._clearAtInfo(val)
          }
        },
        deep: true
      }
    },
    created () {
    },
    mounted () {
    },
    destroyed () {
    },
    computed: {
      ...mapGetters(['getAccount'])
    },
    methods: {
      ...filters,
      ...mapActions(['loadReceivedNotices', 'loadReadNotices', 'loadReadCount', 'loadFindMsg', 'loadReplyMsg', 'loadReplyMembers', 'loadReplyActivity']),
      setNotices (notices, loadNextPage, type = 0) {
        this.type = type
        this.notices = notices
        this.loadNextPage = loadNextPage
        this.calcNoticesWidth()
      },
      // 在 this.notices 有数据时调用
      calcNoticesWidth () {
        let width = 0
        width = this.notices.length * 320
        width -= 20
        this.$refs['e-notices'].style.width = width + 'px'
      },
      addEvent (event) {
        addWhellEvent(this.$refs['e-wrapper-notice-notices'], this.loadNextPage)
      },
      removeEvent (event) {
        removeWhellEvent(this.$refs['e-wrapper-notice-notices'])
      },
      changeTab (notice, tab) {
        if (tab === 2) {
          this.getLeaveWord(notice)
        } else if (tab === 3) {
          if (this.type === 1) {
            this.getActivityMemebers(notice)
          } else {
            this.getMembers(notice)
          }
        } else {
          notice.currentTab = tab
        }
      },
      // 处理留言显示的名字
      getEchoName (notice, msg = {}, msg2 = {}) {
        let loginName = this.getAccount.name
        let msgCreateName = msg.createByName || msg2.userName
        if (msgCreateName === loginName) {
          return '我'
        }
        if (msgCreateName === notice.name) {
          return '发起人'
        }
        return msgCreateName
      },
      getActivityMemebers (activity) {
        this.notice = activity
        this.loadReplyActivity(activity.activityId).then((data) => {
          for (let item of data) {
            for (let user of item.users) {
              if (!user.headimgurl) {
                user.headimgurl = '/static/image/avatar-girl.jpg'
              }
            }
          }
          this.$set(activity, 'members', data)
          activity.currentTab = 3
        })
      },
      getMembers (notice) {
        this.notice = notice
        this.loadReplyMembers(notice.noticeId).then((data) => {
          for (let item of data) {
            for (let user of item.users) {
              if (!user.headimgurl) {
                user.headimgurl = '/static/image/avatar-girl.jpg'
              }
            }
          }
          this.$set(notice, 'members', data)
          notice.currentTab = 3
        })
      },
      getLeaveWord (notice) {
        this.loadFindMsg({id: notice.noticeId, type: notice.dataType}).then((data) => {
          this.$set(notice, 'msgs', data.list)
          this.$set(notice, 'msgStatus', 1)
          this.$set(notice, 'inputing', false)
          this.$set(notice, 'memberDetailShow', false)
          notice.currentTab = 2
          this.$set(notice, 'replyMessageContent', '')
        })
      },
      replyMsg (notice, msg) {
        notice.currentMsg = msg
        let input = document.getElementById(`input-comment-reply-${notice.noticeId}`)
        input.focus()
        let atContent = `@${msg.createByName} `
        notice.replyMessageContent = atContent
        notice.atContent = atContent
      },
      doReply (notice) {
        let msg = {}
        if (notice.atContent) {
          let atLength = notice.atContent.length
          let message = notice.replyMessageContent.substring(atLength)
          msg = {
            message,
            parentId: notice.currentMsg.parentId,
            userId: notice.currentMsg.createBy,
            userName: notice.currentMsg.createByName,
            noticeId: notice.noticeId
          }
          if (!msg.parentId) {
            msg.parentId = notice.currentMsg.id
          }
        } else {
          let message = notice.replyMessageContent
          msg = {
            message,
            noticeId: notice.noticeId
          }
        }
        if (msg.message) {
          this.loadReplyMsg({msg: msg, type: notice.dataType}).then((data) => {
            if (notice.atContent) {
              for (let item of notice.msgs) {
                if (item.id === data.parentId) {
                  if (!item.noticeMsgs) {
                    item.noticeMsgs = []
                  }
                  item.noticeMsgs.splice(0, 0, data)
                }
              }
            } else {
              if (!notice.msgs) {
                notice.msgs = []
              }
              notice.msgs.splice(0, 0, data)
            }
            this.$nextTick(() => {
              this._toPosition(notice, data.parentId)
            })
            this._clearAtInfo(notice)
          })
        } else {
          this.$alert('请填写回复内容', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }
      },
      _clearAtInfo (notice) {
        notice.replyMessageContent = ''
        notice.atContent = ''
      },
      _toPosition (notice, id = -1) {
        let domId = `#comments-${notice.noticeId}`
        let element = document.querySelector(domId)
        let list = document.querySelectorAll(`${domId} > ul > li`)
        let height = 0
        if (id !== -1) {
          for (let item of list) {
            if (item.id === id) {
              break
            }
            height += item.offsetHeight
          }
        }
        element.scrollTop = height
      }
    }
  }
</script>

<style lang="less">
  @import "../../common/less/common";

  .wrapper-content-panel {
    .padding-mixin(20px, 20px, 0px, 20px);
    height: calc(~"100% - 60px");
    .wrapper-notice-notices {
      width: 100%;
      height: 100%;
      .padding-mixin(0, 0px, 20px, 0px);
      overflow-x: auto;
      overflow-y: auto;
      position: relative;
      .mask {
        position: absolute;
        height: 39px;
        left: 0;
        top: 0;
        right: 0;
      }
      .notices {
        height: 100%;
        .notice {
          width: 300px;
          height: 100%;
          float: left;
          margin-right: 20px;
          &:last-child {
            margin-right: 0;
          }
          .bar-time {
            .bar-time-mixin();
          }
          .wrapper-notice-content {
            position: relative;
            width: 100%;
            height: calc(~"100% - 39px");
            background-color: #ffffff;
            border-radius: 4px;
            header, .wrapper-tabs, article {
              padding: 0 20px;
            }
            header {
              .header-mixin();
            }
            .panel-3 {
              article {
                bottom: 0 !important;
              }
            }
            .wrapper-tabs {
              height: 36px;
              display: flex;
              border-bottom: 1px solid #66A7F9;
              padding: 0 50px !important;
              .tab {
                flex: 1;
                text-align: center;
                padding: 7px;
                margin-right: 45px;
                border-radius: 6px 6px 0px 0px;
                border: 1px solid transparent;
                background-color: transparent;
                bottom: -1px;
                position: relative;
                &:last-child {
                  margin-right: 0;
                }
                &.on {
                  border: 1px solid #66A7F9;
                  background-color: #ffffff;
                  border-bottom: 0;
                  position: relative;
                }
                img {
                  &.unSelected {
                    opacity: 0.35;
                  }
                }
                i[class^="icon"] {
                  font-size: 18px;
                  color: #66A7F9;
                  opacity: 0.4;
                  &.unSelected {
                    opacity: 1;
                  }
                }
                .unReadFlag {
                  background-color: #F64D4D;
                  width: 5px;
                  height: 5px;
                  border-radius: 50%;
                  position: absolute;
                  top: 4px;
                  right: 6px;
                }
              }
            }
            .panel {
              article {
                overflow-y: auto;
                position: absolute;
                left: 0;
                top: 94px;
                right: 0;
                bottom: 75px;
                .from, .title, .content, .attachments {
                  margin-top: 16px;
                }
                .from {
                  color: #9AA1AE;
                  font-size: 12px;
                  .dept, .name {
                    display: inline-block;
                    .ellipsis-mixin;
                  }
                  .dept {
                    width: calc(~"100% - 40px");
                  }
                  .name {
                    width: 40px;
                    float: right;
                    text-align: right;
                  }
                }
                .title {
                  color: #121212;
                  font-size: 16px;
                  line-height:24px;
                }
                .content {
                  color: #4D4D4D;
                  font-size: 14px;
                  line-height: 24px;
                  img, video {
                    max-width: 100%;
                  }
                }
              }
              footer {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 74px;
                border-top: 1px solid #F4F4F4;
                padding: 0 20px;
                font-size: 14px;
                background-color: #F7F8FA;
                .noReply {
                  .el-select {
                    width: 180px;
                    margin-right: 15px;
                    .el-input__inner {
                      height: 34px;
                      outline: none;
                      border-radius: 4px;
                      border: 1px solid #E7E7E7;
                      background-color: #ffffff;
                    }
                  }
                }
                .btn-base {
                  font-size: 12px;
                  margin-top: 20px;
                  line-height: 12px;
                  color: #fff;
                  background-color: #66A7F9;
                  display: inline-block;
                  border-radius: 4px;
                  padding: 11px 18px;
                  &:hover {
                    background-color: #5392E1;
                  }
                }
                .hasReply {
                  padding: 22px 0;
                  box-sizing: border-box;
                  .reply-name, span, .btn {
                    line-height: 30px;
                    display: inline-block;
                  }
                  .reply-name {
                    float: left;
                    color: #9AA1AE;
                  }
                  span {
                    .ellipsis-mixin;
                    color: #121212;
                    width: calc(~"100% - 106px");
                  }
                  .btn-edit {
                    width: 62px;
                    height: 28px;
                    line-height: 28px;
                    color: #9AA1AE;
                    border-radius: 15px;
                    border: 1px solid #9AA1AE;
                    text-align: center;
                    float: right;
                    &:hover {
                      color: #6DA2E5;
                      border: 1px solid #6DA2E5;
                    }
                  }
                }
                .input-reply {
                  margin-right: 15px;
                  margin-top: 7px;
                  float: left;
                  width: 180px;
                  textarea {
                    width: 100%;
                    height: 34px;
                    line-height: 32px;
                    margin-top: 13px;
                    border: 1px solid #CBD1DC;
                    border-radius: 4px;
                    padding: 0 12px;
                    box-sizing: border-box;
                    outline: none;
                    resize: none;
                    &.on {
                      padding: 2px 12px;
                      height: 61px;
                      line-height: 18px;
                      margin-top: 0px !important;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .panel-3 {
    article {
      bottom: 0 !important;
    }
  }
  .panel {
    article {
      overflow-y: auto;
      position: absolute;
      left: 0;
      top: 94px;
      right: 0;
      bottom: 75px;
      .from, .title, .content, .attachments {
        margin-top: 19px;
      }
      .from {
        color: #9AA1AE;
        font-size: 12px;
        .dept, .name {
          display: inline-block;
          .ellipsis-mixin;
        }
        .dept {
          width: calc(~"100% - 40px");
        }
        .name {
          width: 40px;
          float: right;
          text-align: right;
        }
      }
      .title {
        color: #121212;
        font-size: 16px;
        line-height:24px;
      }
      .content {
        color: #838383;
        font-size: 14px;
        line-height:23px;
        img, video {
          max-width: 100%;
        }
      }
      // 评论面板
      .comments {
        font-size: 14px;
        position: relative;
        .comment {
          .header-comment {
            height: 58px;
            padding: 17px 18px;
            box-sizing: border-box;
            .name, .wrapper-avatar {
              line-height: 24px;
              float: left;
              &.me {
                float: right;
              }
            }
            .name {
              font-size: 14px;
              color: #9AA1AE;
              margin-left: 10px;
              &.me {
                margin-right: 8px;
              }
            }
            .wrapper-avatar {
              position: relative;
              .avatar {
                width: 24px;
                height: 24px;
                border-radius: 50%;
              }
              .sj {
                position: absolute;
                left: 5px;
                top: 32px;
              }
            }
          }
          .body-comment {
            background-color: #DAE5F2;
            border-radius: 10px;
            padding: 20px;
            box-sizing: border-box;
            .content-comment {
              color: #121212;
              &.me {
                text-align: right;
              }
            }
            .footer {
              margin-top: 10px;
              height: 16px;
              .time, .btn-reply {
                display: inline-block;
              }
              .time {
                font-size: 12px;
                color: #9AA1AE;
                width: calc(~"100% - 14px");
                float: left;
              }
              .btn-reply {
                width: 14px;
                float: right;
              }
            }
            .ats {
              .at {
                border-top: 1px solid #CBD1DC;
                margin-top: 16px;
                padding-top: 16px;
                .wrapper-content-comment {
                  .avatar, .at-name, .content-comment {
                    display: inline-block;
                    line-height: 24px;
                  }
                  .avatar {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    vertical-align: top;
                    margin-right: 10px;
                  }
                  .content-comment {
                    margin-left: 10px;
                    width: calc(~"100% - 34px");
                    .at-name {
                      color: #9AA1AE;
                    }
                  }
                }
              }
            }
          }
        }
      }
      // 人员面板
      .members {
        .member {
          &:first-child {
            .title-member {
              margin-top: 30px;
            }
          }
          .title-member {
            line-height: 14px;
            width: 100%;
            color: #4D4D4D;
            font-size: 14px;
            display: flex;
            margin-top: 20px;
            margin-bottom: 23px;
            .left, .right {
              flex: 1;
              border-top: 1px solid #E6E9ED;
              height: 1px;
              margin-top: 7px;
            }
            .middle {
              padding: 0 10px;
              box-sizing: border-box;
              max-width: 75%;
              text-align: center;
              .ellipsis-mixin;
            }
          }
          .avatars-member {
            overflow: hidden;
            .avatar-member {
              display: inline-block;
              width: calc(~"(100% - 50px) / 6");
              margin-right: 10px;
              margin-bottom: 15px;
              &:nth-child(6n) {
                margin-right: 0;
              }
              .name {
                margin-top: 4px;
                height: 12px;
                line-height: 12px;
                font-size: 12px;
                text-align: center;
                .ellipsis-mixin();
              }
            }
          }
        }
      }
    }
  }
</style>
