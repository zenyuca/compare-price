<template lang="pug">
  #createActivity.wrapper-content
    c-header.wrapper-createNotice-header(:menuNames="menuNames")
      .goback(slot='right', v-if="activityId")
        img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    .wrapper-createNotice-content
      .wrapper-createNotice-middle
        .left
          .wrapper-row
            .row
              header
                span.must
                  | *
                | 活动名称
              c-input(:outClassName="{'has-content': activity.name}", placeholder="请输入通知的标题（40字以内）", :max="40", v-model="activity.name")
            .row
              header
                span.must
                  | *
                | 活动日期
              el-date-picker(v-model="activityTimeRange", placeholder="活动日期", type="datetimerange",range-separator=" 至 ",start-placeholder="开始日期",end-placeholder="结束日期")
            .row
              header
                span.must
                  | *
                | 报名日期
              el-date-picker(v-model="activityEntryTimeRange", placeholder="报名日期", type="datetimerange",range-separator=" 至 ",start-placeholder="开始日期",end-placeholder="结束日期")
            .row
              header
                span.must
                  | *
                | 报名人数
              el-input(type="number", placeholder="请输入报名人数", min="1", max="10000", v-model="activity.total")
            .row
              header
                span.must
                  | *
                | 活动地址
              c-input(:outClassName="{'has-content': activity.place}", placeholder="请输入通知的标题（40字以内）", :max="40", v-model="activity.place")
            .row
              header
                span.must
                  | *
                | 活动内容
              u-editor(ref="ueditor")
            .row
              header
                | 附件（只能上传pdf文件）
              c-upload-attchment(ref="c-upload-attchment")
          .wrapper-btn-bar
            .btn.btn-create.on(@click="publish")
              | {{ btnName }}
            .btn.btn-clean(@click="clean", v-if="!activityId")
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
  import { Loading } from 'element-ui'
  import filters from '../../../core/filters'

  let activityId = ''

  export default {
    name: 'createActivity',
    components: {
      CHeader,
      CInput,
      UEditor,
      CMemberSelect,
      CUploadAttchment
    },
    beforeRouteEnter (to, from, next) {
      activityId = to.params.activityId
      next()
    },
    data () {
      return {
        loadingInstance: null,
        loadDone: false,
        menuNames: [
          {
            name: '发起活动',
            route: '',
            on: true
          }
        ],
        activity: {
          name: '',
          detail: '',
          replys: [
            {
              id: uuid(),
              value: ''
            }
          ],
          admins: [],
          files: [],
          place: '',
          total: '',
          start: null,
          end: null,
          entryStart: null,
          entryEnd: null
        },
        contacts: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        openFilter: false,
        isAllSelected: true,
        currentDeptLevel: 1,
        sendeeId: {},
        depts: [],
        btnName: '',
        activityTimeRange: [],
        activityEntryTimeRange: [],
        // 上传组件对象
        cUploadAttchment: {},
        // 编辑器组件对象
        cUEditor: {},
        // 人员选择组件对象
        cMemberSelect: {}
      }
    },
    created () {
      this.activityId = activityId
      if (this.activityId) {
        // 查看编辑
        this.loadSendDetailsData()
        this.btnName = '修改'
        this.menuNames[0].name = '编辑活动'
      } else {
        // 创建逻辑
        this.btnName = '发布'
      }
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
      ...mapActions(['loadAllDept', 'findSendeeId', 'createActivity', 'loadSendMeetingDetails', 'uploadFile', 'goBack']),
      loadContactsData () {
        this.loadingInstance = Loading.service({text: '工会信息较多，正拼命加载中...'})
        this.loadAllDept({}).then((data) => {
          this.contacts = data
          this.$nextTick(() => {
            if (this.loadingInstance) {
              if (activityId) { // 如果不为空，则为编辑，为空则为新建，默认勾选所有
                this.$refs.tree.setCheckedNodes(this.activity.admins)
              } else {
                this.$refs.tree.setCheckedNodes(this.contacts)
              }
              this.loadingInstance.close()
            }
          })
        })
      },
      loadSendDetailsData () {
        this.loadSendMeetingDetails(activityId).then((data) => {
          let replys = []
          for (let item of data.noticeCopies) {
            let copy = {
              id: item.copyContentId,
              value: item.copyContent
            }
            replys.push(copy)
          }
          let o = {
            name: data.name,
            content: data.content,
            replys: replys
          }
          this.$refs['ueditor'].setUEContent(data.content)
          this.activity = o
          this.activity.files = data.files
          this.activity.admins = data.admins
          this.activity.address = data.address
        })
      },
      clean () {
        this.activity = {
          name: '',
          detail: '',
          replys: [
            {
              id: uuid(),
              value: ''
            }
          ],
          admins: [],
          files: [],
          place: '',
          total: '',
          start: null,
          end: null,
          entryStart: null,
          entryEnd: null
        }
        this.activityTimeRange = []
        this.activityEntryTimeRange = []
        this.cUEditor.setUEContent('')
        this.cUploadAttchment.cleanFileList()
      },
      publish () {
        this.activity.admins = this.cMemberSelect.getNodes()
        this.activity.detail = this.cUEditor.getUEContent()
        this.activity.files = this.cUploadAttchment.getFileList()
        this.activity.start = this.activityTimeRange[0]
        this.activity.end = this.activityTimeRange[1]
        this.activity.entryStart = this.activityEntryTimeRange[0]
        this.activity.entryEnd = this.activityEntryTimeRange[1]
        if (!this.checkCanCreate()) {
          return
        }
        this.loadingInstance = Loading.service({text: `${this.btnName}中，请耐心等待……`})
        this.createActivity(this.activity).then((data) => {
          this.loadingInstance.close()
          if (!this.activityId) {
            this.clean()
          }
          this.$alert(`${this.btnName}成功`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        })
      },
      checkCanCreate () {
        if (this.activity.name === '' || this.activityTimeRange.length === 0 || this.activityEntryTimeRange.length === 0 || this.activity.total === '' || this.activity.place === '' || this.activity.detail === '') {
          this.$alert('红星标注为必填项', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
          return false
        }
        if (!/^\d+$/g.test(this.activity.total) || this.activity.total === '0') {
          this.$alert('报名人数必须为正整数', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
          return false
        }
        if (this.activity.admins.length === 0) {
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

  #createActivity {
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

    .el-date-editor {
      width: 100%;
    }
  }
</style>
