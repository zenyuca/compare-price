<template lang="pug">
  #createNotice.wrapper-content
    c-header.wrapper-createNotice-header(:menuNames="menuNames")
      .goback(slot='right', v-if="meetingId")
        img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    .wrapper-createNotice-content
      .wrapper-createNotice-middle
        .left
          .wrapper-row
            .row
              header
                span.must
                  | *
                | 会议名称
              c-input(:outClassName="{'has-content': meeting.title}", placeholder="请输入通知的标题（40字以内）", :max="40", v-model="meeting.title")
            .row
              header
                span.must
                  | *
                | 会议日期
              el-date-picker(placeholder="请填写会议日期", style="width: 100%", v-model="meetingDateRange",type="daterange",range-separator=" 至 ",start-placeholder="开始日期",end-placeholder="结束日期")
            .row
              header
                span.must
                  | *
                | 会议地址选择
              .select
              el-select(style="width: 100%", v-model="searchType")
                el-option(v-for="item in addressOptions", :key="item.value", :label="item.label", :value="item.value")
            .row
              header
                span.must
                  | *
                | 内容
              u-editor(ref="ueditor")
            .row
              header
                | 附件（只能上传pdf文件）
              c-upload-attchment(ref="c-upload-attchment")
            .row
              header
                span.must
                  | *
                | 回复项设置
                span.tip
                  | 最多设置5项
              .wrapper.box-input(v-for="reply in meeting.replys", :class="{'has-content': reply.value}")
                input(placeholder="请输入回复内容", v-model="reply.value")
                .icon(@click="delReply(reply)")
                  img(src="../common/icon/icon-del.png")
              .btn-add(@click="addReply()")
                | + 添加
          .wrapper-btn-bar
            .btn.btn-create.on(@click="publish")
              | {{ btnName }}
            .btn.btn-clean(@click="clean", v-if="!meetingId")
              | 清空
        c-member-select(ref="c-member-select")
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CInput from '../../common/input/cInput.vue'
  import CMemberSelect from '../common/cMemberSelect.vue'
  import CUploadAttchment from '../common/cUploadAttchment.vue'
  import UEditor from '../../common/ueditor/ueditor.vue'
  import { mapGetters, mapActions } from 'vuex'
  import { uuid } from '../../../core/utils/tool'
  import _ from 'lodash'
  import { Loading } from 'element-ui'
  import filters from '../../../core/filters'

  let meetingId = ''

  export default {
    name: 'createMeeting',
    components: {
      CHeader,
      CInput,
      UEditor,
      CMemberSelect,
      CUploadAttchment
    },
    beforeRouteEnter (to, from, next) {
      meetingId = to.params.meetingId
      next()
    },
    data () {
      return {
        menuNames: [
          {
            name: '发布会议',
            route: '',
            on: true
          }
        ],
        meeting: {
          title: '',
          content: '',
          replys: [
            {
              id: uuid(),
              value: ''
            }
          ],
          admins: [],
          fileList: [],
          address: '',
          start: null,
          end: null
        },
        btnName: '',
        searchType: '',
        addressOptions: [],
        meetingDateRange: null,
        // 上传组件对象
        cUploadAttchment: {},
        // 编辑器组件对象
        cUEditor: {},
        // 人员选择组件对象
        cMemberSelect: {}
      }
    },
    created () {
      this.meetingId = meetingId
      if (this.meetingId) {
        // 查看编辑
        this.loadSendDetailsData()
        this.btnName = '修改'
        this.menuNames[0].name = '编辑会议'
      } else {
        // 创建逻辑
        this.btnName = '发布'
      }
      this.loadCheckTypeList()
    },
    mounted () {
      this.cUploadAttchment = this.$refs['c-upload-attchment']
      this.cUEditor = this.$refs['ueditor']
      this.cMemberSelect = this.$refs['c-member-select']
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['loadAllDept', 'findSendeeId', 'createMeeting', 'loadSendMeetingDetails', 'uploadFile', 'goBack', 'loadConfigure']),
      loadSendDetailsData () {
        this.loadSendMeetingDetails(meetingId).then((data) => {
          let replys = []
          for (let item of data.noticeCopies) {
            let copy = {
              id: item.copyContentId,
              value: item.copyContent
            }
            replys.push(copy)
          }
          let o = {
            title: data.title,
            content: data.content,
            replys: replys
          }
          this.$refs['ueditor'].setUEContent(data.content)
          this.meeting = o
          this.meeting.fileList = data.fileList
          this.meeting.admins = data.admins
          this.meeting.address = data.address
        })
      },
      addReply () {
        let max = 5
        let list = this.meeting.replys
        let length = list.length
        if (length >= max) {
          this.$alert(`回复项最多设置${max}项`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          return
        }
        let reply = {
          id: uuid(),
          value: ''
        }
        list.push(reply)
      },
      delReply (reply) {
        let list = _.cloneDeep(this.meeting.replys)
        _.remove(list, (e) => {
          if (e.id === reply.id) {
            return true
          }
        })
        this.meeting.replys = list
      },
      clean () {
        this.meeting = {
          title: '',
          content: '',
          replys: [
            {
              id: uuid(),
              value: ''
            }
          ],
          admins: [],
          fileList: [],
          address: '',
          start: null,
          end: null
        }
        this.meetingDateRange = []
        this.cUEditor.setUEContent('')
        this.cUploadAttchment.cleanFileList()
      },
      publish () {
        this.meeting.content = this.cUEditor.getUEContent()
        this.meeting.admins = this.cMemberSelect.getNodes()
        this.meeting.fileList = this.cUploadAttchment.getFileList()
        this.meeting.address = this.searchType
        this.meeting.start = this.meetingDateRange[0]
        this.meeting.end = this.meetingDateRange[1]
        if (!this.checkCanCreate()) {
          return
        }
        this.loadingInstance = Loading.service({text: `${this.btnName}中，请耐心等待……`})
        this.createMeeting(this.meeting).then((data) => {
          this.loadingInstance.close()
          if (!this.meetingId) {
            this.clean()
          }
          this.$alert(`${this.btnName}成功`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        })
      },
      loadCheckTypeList () {
        let type = 3
        this.loadConfigure(type).then((data) => {
          for (let item of data) {
            let o = {
              value: item.text,
              label: item.text
            }
            this.addressOptions.push(o)
          }
        })
      },
      checkCanCreate () {
        if (this.meeting.title === '' || this.meetingDateRange.length === 0 || this.searchType === '' || this.meeting.content === '<p>请输入内容</p>' || this.meeting.replys.length === 0 || this.meeting.replys[0].value === '') {
          this.$alert('红星标注为必填项', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
          return false
        }
        if (this.meeting.admins.length === 0) {
          this.$alert('至少选择一个接收人', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
          return false
        }
        return true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/less/common";
  @import "../common/less/common-office";

  @content-height: 100%;
  @contacts-header-height: 72px;
  @wrapper-btn-bar-height: 80px;
  @rightWidth: 435px;

  #createNotice {
    width: 100%;
    height: 100%;

    font-size:  16px;
    box-sizing: border-box;
    .wrapper-createNotice-header {
      .toolbar {
        height: 60px;
      }
    }
    .wrapper-createNotice-content {
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      height: calc(~"100% - 60px");
      .wrapper-createNotice-middle {
        width: 100%;
        height: @content-height;
        overflow: auto;
        .left, .right {
          height: 100%;
          float: left;
          background-color: #ffffff;
          border-radius: 4px;
        }
        .left {
          width: calc(~"100% - 5px - " @rightWidth);
          margin-right: 5px;
          padding: 30px 10px 0px 25px;
          box-sizing: border-box;
          font-size: 14px;
          overflow: auto;
          position: relative;
          .wrapper-row {
            height: calc(~"100%" - @wrapper-btn-bar-height);
            overflow-y: auto;
            padding-right: 25px;
            .row {
              margin-bottom: 25px;
              header {
                margin-bottom: 20px;
                .must, tip {
                  display: inline-block;
                }
                .must {
                  font-size: 14px;
                  color: #FF5858;
                  vertical-align: middle;
                  margin-right: 5px;
                }
                .tip {
                  color: #C0C0C0;
                  margin-left: 5px;
                }
              }
              .box-content {
                height: 80px;
              }
              .has-content {
                transition: background-color 0.5s ease-in-out;
                background-color: #F7F8FA;
              }
              .wrapper {
                position: relative;
                margin-bottom: 20px;
                input {
                  border: 0;
                  background-color: transparent;
                  width: calc(~"100% - 60px");
                }
                input[disabled] {
                  background-color: transparent;
                }
                .icon {
                  position: absolute;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  width: 59px;
                  height: 100%;
                  border-left: 1px solid #E7E7E7;
                  text-align: center;
                  line-height: 45px;
                  cursor: pointer;
                }
              }
              .btn-add {
                width: 128px;
                height: 38px;
                line-height: 38px;
                border-radius: 4px;
                border: 1px solid #DDDDDD;
                color: #4D4D4D;
                background-color: #F0F0F0;
                text-align: center;
                cursor: pointer;
              }
            }
          }
          .wrapper-btn-bar {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: @wrapper-btn-bar-height;
            border-top: 1px solid #F8F8F8;
            padding: 20px 0;
            box-sizing: border-box;
          }
        }
      }
    }

    // 对 tree 的修正
    .contact-item, .contact-avatar, .contact-name-job {
      display: inline-block;
    }
    .dept {
      color: #9AA1AE;
      font-size: 14px;
    }
    .contact-item {
      flex: 1;
      padding: 12px 0;
      line-height: 32px;
      .contact-avatar, .contact-name, .contact-job {
        float: left;
      }
      .contact-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 11px;
        margin-left: 6px;
      }
      .contact-name{
        color: #4D4D4D;
        font-size: 14px;
      }
      .contact-job {
        float: right;
        color: #9AA1AE;
        font-size: 14px;
      }
    }

    .el-tree {
      border: 0;
      padding-right: 17px;
      padding-bottom: 20px;
      .el-tree-node__content {
        line-height: 56px;
        height: 56px;
        &:hover {
          background-color: transparent;
        }
      }
      .el-tree-node__children {
        .el-tree-node {
          .el-tree-node__content {
            display: flex;
            .contact-item {
              border-bottom: 1px solid #F0F0F0;
            }
            .el-tree-node__expand-icon {
              margin-top: 22px;
              margin-right: 10px;
            }
          }
          &:last-child {
            .contact-item {
              border-bottom: none;
            }
          }
        }
      }
    }
  }
</style>
