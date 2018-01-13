article
<template lang="pug">
  #receivedRequest.wrapper-content
    c-header.wrapper-receivedRequest-header(:menuNames="menuNames")
    .wrapper-receivedRequest-content
      .wrapper-receivedRequest-notices(ref="e-wrapper-receivedRequest-notices")
        ul.notices(ref="e-checks")
          li.notice(v-for="(approval,index) in approvals")
            .bar-time(@mouseover="addEvent")
              span.time
                | {{ approval.time }}
            .wrapper-notice-content
              header.borderBttom1px(@mouseover="addEvent")
                .type
                  | {{ approval.approvalType }}
              article(@mouseover="removeEvent")
                .seal
                  img(src="../common/icon/icon-request-ok.png",v-if='approval.status === 2')
                  img(src="../common/icon/icon-request-no.png",v-if='approval.status === 3')
                .info
                  .avatar
                    img(:src="approval.avatar")
                  .content
                    .name
                      | {{ approval.name }}
                    .status-request.on
                      | {{approval.agreeText}}
                .request-content
                  ul
                    li
                      label
                        | 标题：
                      span
                        | {{ approval.title }}
                    li
                      label
                        | 内容：
                      span
                        | {{ approval.content }}
                    li(v-if="approval.images && approval.images.length > 0")
                      label
                        | 图片：
                      c-check-image-list(:images="approval.images")
                    li(v-if="approval.attachments && approval.attachments.length > 0")
                      label
                        | 附件：
                      c-attachment-list(:attachments="approval.attachments")
                // 评论列表
                c-request-comment-list(:comments="approval.comments")
                .request-copy
                  .copy-title
                    span
                      | 抄送
                    | 审批通过后通知抄送人
                  ul.copies
                    li.copy(v-for="copy in approval.copies")
                      .avatar
                        img(:src="copy.avatar")
                      .name
                        | {{ copy.name }}
              footer
                .btn-bar
                  .btn.btn-comment(@click="sendMsg('评论', approval, index)")
                    | 评论
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CAttachmentList from '../common/cAttachmentList.vue'
  import CRequestCommentList from '../common/cRequestCommentList.vue'
  import CCheckImageList from '../common/cCheckImageList.vue'
  import { addWhellEvent, removeWhellEvent } from '../../../core/utils/event'
  import filters from '../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'receivedPublic',
    components: {
      CHeader,
      CAttachmentList,
      CRequestCommentList,
      CCheckImageList
    },
    data () {
      return {
        badgeCount: 0,
        menuID: 'notice/received',
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
        deal: false,
        noDeal: false,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        approvals: [],
        inputMsgValue: ''
      }
    },
    watch: {
      approvals: {
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
      this.resetPage()
      this.loadData()
      this.badgeCount = this.getShareData.unReadCount.approval
    },
    mounted () {
    },
    destroyed () {
    },
    computed: {
      ...mapGetters(['getPage', 'getMenus', 'getShareData', 'getAccount'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'loadPublishApprovals', 'loadReadNotices', 'loadReadCount', 'loadComment2', 'loadApprovalById2']),
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
        this.loadPublishApprovals(keyParam).then((data) => {
          this.getPage.hasNextPage = data.total !== this.approvals.length
          this.getPage.page += 1
          for (let item of data.list) {
            this.approvals.push(this.assembleData(item))
          }
          this.$nextTick(() => {
            this._calcNoticesWidth()
            e.loading = false
          })
        })
      },
      assembleData (item) {
        let comments = [
          {
            avatar: item.avatar,
            name: item.adminName,
            action: '发起申请',
            time: new Date(item.created).Format('MM-dd hh:mm')
          }
        ]
        for (let app of item.approves) {
          if (app.isApproval === 1) {
            let copy = {
              userId: app.userId,
              avatar: app.avatar,
              name: app.name,
              msgStatus: item.msgStatus,
              action: this.agreeTypeFilter(app.agreeType),
              agreeType: app.agreeType,
              time: new Date(app.createTime).Format('MM-dd hh:mm'),
              msg: app.comment,
              isApproval: app.isApproval,
              orderNum: app.orderNum
            }
            comments.push(copy)
          }
        }
        for (let app of item.approves) {
          if (!app.isApproval && !app.isCc) {
            let comment = {
              userId: app.userId,
              avatar: app.avatar,
              name: app.name,
              time: new Date(app.updateTime).Format('MM-dd hh:mm'),
              msg: app.comment
            }
            comments.push(comment)
          }
        }
        let copies = []
        for (let app of item.approves) {
          if (app.isCc === 1) {
            let copy = {
              avatar: app.avatar,
              name: app.name
            }
            copies.push(copy)
          }
        }

        let attachments = []
        let images = []
        for (let file of item.files) { // 遍历 区分附件或图片
          if (file.type === 5) {
            attachments.push(file)
          }
          if (file.type === 10) {
            images.push(file)
          }
        }

        let o = {
          approvalId: item.id,
          day: this.dateTodayFilter(item.created),
          time: this.dateTodayFilter(item.created),
          type: this.noticeTypeFilter(item.type),
          status: item.status,
          from: item.deptName,
          name: item.adminName,
          attachments: attachments,
          approvalType: item.approvalType,
          title: item.title,
          avatar: item.avatar,
          content: item.content,
          createBy: item.createBy,
          agreeText: this.agreeTyptToText(item),
          comments,
          copies,
          images: images
        }
        return o
      },
      agreeTyptToText (item) {
        if (item.status === 0) {
          if (item.agreeType === 0 || item.agreeType === 1) {
            return '等待审批'
          } else if (item.agreeType === 2) {
            return '审批通过'
          } else if (item.agreeType === 3) {
            return '审批被拒绝'
          } else {}
        } else {
          if (item.status === 2) {
            return '审批通过'
          } else if (item.status === 3) {
            return '审批被拒绝'
          } else {}
        }
      },
      agreeTypeToRead (agreeType) {
        if (agreeType === 0 || agreeType === 1) {
          return 0
        }
        return 1
      },
      // 在 this.notices 有数据时调用
      _calcNoticesWidth () {
        let width = 0
        width = this.approvals.length * 320
        width -= 20
        this.$refs['e-checks'].style.width = width + 'px'
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
          this.getShareData.unReadCount.approval = data
          this._updateBadgeCount()
        })
      },
      resetChangePage () {
        this.getPage.page = 1
        this.approvals = []
        this.getPage.hasNextPage = true
      },
      addEvent (event) {
        addWhellEvent(this.$refs['e-wrapper-receivedRequest-notices'], this.loadData)
      },
      removeEvent (event) {
        removeWhellEvent(this.$refs['e-wrapper-receivedRequest-notices'])
      },
      getApprovalById (approval, index) {
        this.loadApprovalById2(approval.approvalId).then((data) => {
          this.approvals.splice(index, 1, this.assembleData(data))
        }).catch((data) => {
          alert(data.msg)
        })
      },
      sendMsg (title, approval, index) {
        let e = document.getElementById('inputMsgValue')
        if (e) {
          e.value = ''
        }
        const h = this.$createElement
        this.$msgbox({
          title: title,
          message: h('textarea', {
            attrs: {
              class: 'input-msg',
              id: 'inputMsgValue',
              placeholder: `请输入${title}`
            }
          }),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              e = document.getElementById('inputMsgValue')
              let value = e.value
              approval.comment = value
              approval.workId = approval.approvalId
              this.loadComment2(approval).then((data) => {
                this.getApprovalById(approval, index)
              }).catch((data) => {
              })
              done()
            } else {
              done()
            }
          }
        }).then(action => {
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../common/less/request";
</style>
