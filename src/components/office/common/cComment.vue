<template lang="pug">
  #cComment
    .panel(v-show="notice.currentTab === 2")
      article(:id="`comments-${notice.noticeId}`")
        ul.comments
          li.comment(v-for="msg in notice.msgs", :id="msg.id")
            .header-comment
              .wrapper-avatar.btn(:class="{'me': msg.createBy === getAccount.userid}")
                c-boxtip(:user="msg")
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
                    c-boxtip(:user="msg2")
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
    .panel.panel-3(v-show="notice.currentTab === 3")
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
</template>

<script>
  import CBoxtip from '../../common/boxtip/cBoxtip.vue'
  import filters from '../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: '',
    components: {
      CBoxtip
    },
    data () {
      return {
        notice: {
          currentTab: 1
        }
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
      setNotice (notice) {
        this.notice = notice
        this.getLeaveWord(this.notice)
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
        this.loadFindMsg(notice.noticeId).then((data) => {
          this.$set(notice, 'msgs', data.list)
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
          this.loadReplyMsg(msg).then((data) => {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/less/common";
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
            background-color: #E6E9ED;
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
            color: #9AA1AE;
            font-size: 14px;
            display: flex;
            margin-top: 20px;
            margin-bottom: 23px;
            .left, .right {
              flex: 1;
              border-top: 1px solid;
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
            .avatar-member {
              display: inline-block;
              margin-right: 5px;
              margin-bottom: 10px;
              &:nth-child(9n + 0) {
                margin-right: 0;
              }
              img {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
              }
            }
          }
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
        background-color: #6da2e5;
        display: inline-block;
        border-radius: 4px;
        padding: 11px 18px;
        &:hover {
          background-color: #477cbe;
        }
      }
      .hasReply {
        height: 100%;
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
</style>
