<template lang="pug">
  #createRequest.wrapper-content
    c-header.wrapper-createRequest-header(:menuNames="menuNames")
      .goback(slot='right', v-if="approvalId")
        img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    .wrapper-createRequest-content
      .wrapper-createRequest-middle
        .left
          .wrapper-row
            .row
              header
                span.must(v-if="!approvalId")
                  | *
                | 审批标题
              c-input(:disabled="approvalId", :outClassName="{'has-content': approval.title}", placeholder="请输入请示的标题（40字以内）", :max="40", v-model="approval.title")
            .row
              header
                span.must(v-if="!approvalId")
                  | *
                | 审批内容
              c-input(:disabled="approvalId", :outClassName="{'has-content': approval.content}", placeholder="请输入请示的内容（200字以内）", :max="200", v-model="approval.content")
            .row
              header
                span.must(v-if="!approvalId")
                  | *
                | 审批类型
              el-select(v-if="!approvalId", v-model="checkType", placeholder="请选择审批类型", style="width: 100%")
                el-option(v-for="item in checkTypeList", :key="item.value", :label="item.label", :value="item.value")
              el-input.approvalType(v-if="approvalId", :value="approval.approvalType", readonly="readonly")
            .row
              header
                | 图片
              el-upload(v-if="!approvalId", ref="upload", :on-success="onSuccess", :on-remove="handleRemove", :action="uploadUrl", list-type="picture-card", :on-preview="handlePictureCardPreview")
                i.el-icon-plus
              ul(v-if="approvalId")
                li(v-for="file in approval.fileList")
                  img(:src="file.url")
              el-dialog(v-model="dialogVisible", size="tiny")
                img(width="100%", :src="dialogImageUrl", alt="")
            .row
              header
                | 附件（只能上传pdf文件）
              c-upload-attchment(ref="c-upload-attchment", :hiddenBtn="approvalId")
          .wrapper-btn-bar(v-if="!approvalId")
            .btn.btn-create.on(@click="publish")
              | {{ btnName }}
            .btn.btn-clean(@click="clean")
              | 清空
        .right
          modal(ref="pop", title="选人", @ok="ok", @reset="reset")
            .wrapper
              el-input(icon="search", placeholder="搜索名字", v-model="searchValue")
              ul.list
                li.item(v-for = "people in selectList")
                  .name
                    | {{ people.name }}
                    .del(@click="delSelectedPeople(people)")
                      | +
            el-tree(:data="members", show-checkbox, :indent="25", node-key="id", :render-content="renderContent", :default-expanded-keys="[0]", :default-checked-keys="[0]", :props="defaultProps", ref="tree", @check-change="checkChange")
          header
            .btn-select
              | 审批人
          ul.peoples
            li.people(v-for = "approve in approves")
              .info
                img.avatar(:src="approve.avatar")
                .name
                  | {{ approve.name }}
              .nextstep(v-if="!approvalId")
                img(src="../common/icon/icon-nextstep.png")
              .del(v-if="!approvalId", @click="delSelectedPeople(approve, 1)")
                | +
            li.add(v-if="approves.length < 5 && !approvalId")
              .btn.btn-add(@click="selectMembers(1)")
               | 添加
          header
            .btn-select
              | 抄送人
          ul.peoples
            li.people(v-for = "approve in copies")
              .info
                img.avatar(:src="approve.avatar")
                .name
                  | {{ approve.name }}
              .nextstep(v-if="!approvalId")
                img(src="../common/icon/icon-nextstep.png")
              .del(v-if="!approvalId", @click="delSelectedPeople(approve, 2)")
                | +
            li.add(v-if="copies.length < 5 && !approvalId")
              .btn.btn-add(@click="selectMembers(2)")
                | 添加
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CInput from '../../common/input/cInput.vue'
  import config from '../../../core/config'
  import CUploadAttchment from '../common/cUploadAttchment.vue'
  import Modal from '../../common/modal/modal.vue'
  import { mapGetters, mapActions } from 'vuex'
  import filters from '../../../core/filters'
  import { Loading } from 'element-ui'
  import _ from 'lodash'

  let approvalId = ''

  export default {
    name: 'createCheck',
    components: {
      CHeader,
      CInput,
      CUploadAttchment,
      Modal
    },
    beforeRouteEnter (to, from, next) {
      approvalId = to.params.approvalId
      next()
    },
    data () {
      return {
        ...config,
        approvalId: '',
        menuNames: [
          {
            name: '发起审批',
            route: '',
            on: true
          }
        ],
        // 审批类型
        checkType: '',
        // 审批类型列表
        checkTypeList: [],
        // 审批人列表
        approves: [],
        // 抄送人列表
        copies: [],
        // 当前选择的联系人
        selectList: [],
        // 1 表示选择的是审批人；2 表示选择的是抄送人
        type: 1,
        maxLength: 5,
        // 工会成员
        members: [],
        membersCopy: [],
        // 工会成员选择框的值
        searchValue: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        // 请示对象
        approval: {
          title: '',
          content: '',
          fileList: []
        },
        btnName: '',
        // 上传组件对象
        cUploadAttchment: {},
        dialogVisible: false,
        dialogImageUrl: ''
      }
    },
    watch: {
      $route: function (val, oldVal) {
      },
      searchValue: function (val, oldVal) {
        let checkList = []
        if (val) {
          let list = []
          for (let item of this.membersCopy) {
            let name = item.name
            if (name.indexOf(val) > -1) {
              list.push(item)
            }
          }
          this.members = list
        } else {
          this.members = this.membersCopy
        }
        checkList = this.selectList
        if (checkList.length > 0) {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedNodes(checkList)
          })
        }
      }
    },
    created () {
      this.approvalId = approvalId
      if (this.approvalId) {
        // 查看编辑
        this.loadSendDetailsData(approvalId)
        this.menuNames[0].name = '审批详情'
      } else {
        this.btnName = '发布'
      }
      this.loadCheckTypeList()
    },
    mounted () {
      this.cUploadAttchment = this.$refs['c-upload-attchment']
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['getCurrentDeptMembers', 'createApproval', 'loadConfigure', 'loadApprovalById2', 'goBack', 'workUnread']),
      selectMembers (type) {
        let checkList = []
        if (type === 1) {
          checkList = _.cloneDeep(this.approves)
        } else if (type === 2) {
          checkList = _.cloneDeep(this.copies)
        }
        this.getCurrentDeptMembers().then((data) => {
          this.members = data
          this.membersCopy = _.cloneDeep(this.members)
          this.type = type
          this.searchValue = ''
          this.$refs.pop.open()
          if (checkList.length > 0) {
            this.$nextTick(() => {
              this.$refs.tree.setCheckedNodes(checkList)
            })
          }
        })
      },
      renderContent (h, { node, data, store }) {
        if (data.userid) {
          if (!data.avatar) {
            data.avatar = '/static/image/avatar-boy.jpg'
          }

          return h('div', {
            attrs: {
              class: 'contact-item'
            }
          }, [
            h('img', {
              attrs: {
                class: 'contact-avatar',
                src: data.avatar
              }
            }),
            h('div', {
              attrs: {
                class: 'contact-name'
              }
            }, data.name),
            h('div', {
              attrs: {
                class: 'contact-job'
              }
            }, this.positionTypeFilter(data.positionType))
          ], data.name)
        } else {
          return h('span', {
            attrs: {
              class: 'contact-item dept'
            }
          }, data.name)
        }
      },
      delSelectedPeople (item, type) {
        if (type === 1) {
          this.approves = this._removeSelected(this.approves, item)
        } else if (type === 2) {
          this.copies = this._removeSelected(this.copies, item)
        } else {
          this.$refs.tree.setChecked(item, false)
          this.selectList = this._removeSelected(this.selectList, item)
        }
      },
      checkChange (item, status) {
        if (this.selectList.length > this.maxLength - 1) {
          if (status) {
            this.$refs.tree.setChecked(item, false)
            this.$alert(`最多选择${this.maxLength}个人`, '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          }
        }
        if (status) {
          this.selectList.push(item)
        } else {
          this.selectList = this._removeSelected(this.selectList, item)
        }
      },
      ok () {
        if (this.selectList.length === 0) {
          return
        }
        if (this.type === 1) {
          this.approves = _.cloneDeep(this.selectList)
        } else if (this.type === 2) {
          this.copies = _.cloneDeep(this.selectList)
        }
      },
      loadCheckTypeList () {
        let type = 5
        this.loadConfigure(type).then((data) => {
          for (let item of data) {
            let o = {
              value: item.text,
              label: item.text
            }
            this.checkTypeList.push(o)
          }
        })
      },
      reset () {
      },
      _removeSelected (list, item) {
        return _.remove(list, (o) => {
          return o.id !== item.id
        })
      },
      clean () {
        this.approval = {
          title: '',
          content: '',
          fileList: []
        }
        this.checkType = ''
        this.copies = []
        this.approves = []
        this.cUploadAttchment.cleanFileList()
        this.$refs['upload'].clearFiles()
      },
      publish () {
        this.approval.approves = this.approves
        this.approval.copies = this.copies
        this.approval.files = this.cUploadAttchment.getFileList()
        this.approval.approvalType = this.checkType
        if (!this.checkCanCreate()) {
          return
        }
        this.loadingInstance = Loading.service({text: `${this.btnName}中，请耐心等待……`})
        this.createApproval(this.approval, 0).then((data) => {
          this.loadingInstance.close()
          if (!this.requestId) {
            this.clean()
            this.workUnread()
          }
          this.$alert(`${this.btnName}成功`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        })
      },
      checkCanCreate () {
        if (this.approval.title === '' || this.approval.content === '' || this.approval.approvalType === '') {
          this.$alert('红星标注为必填项', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
          return false
        }
        if (this.approval.approves.length === 0) {
          this.$alert('至少选择一个审批人', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
          return false
        }
        return true
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleRemove (file, files) {
        let id = file.response.data.id
        this.approval.fileList = _.remove(this.approval.fileList, (e) => {
          return e.id !== id
        })
      },
      // 上传成功
      onSuccess (response, file, files) {
        this.approval.fileList.push(response.data)
      },
      loadSendDetailsData (approvalId) {
        this.loadApprovalById2(approvalId).then((data) => {
          let approves = []
          let copies = []
          for (let item of data.approves) {
            if (item.isApproval === 1) {
              approves.push(item)
            }
            if (item.isCc === 1) {
              copies.push(item)
            }
          }

          let attachments = []
          let images = []
          for (let file of data.files) { // 遍历 区分附件或图片
            if (file.type === 5) {
              attachments.push(file)
            }
            if (file.type === 10) {
              images.push(file)
            }
          }
          this.approval.title = data.title
          this.approval.content = data.content
          this.approval.fileList = images
          this.approval.approvalType = data.approvalType
          this.cUploadAttchment.setFileList(attachments)
          this.approves = approves
          this.copies = copies
        })
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
  @rightWidth: 486px;

  #createRequest {
    width: 100%;
    height: 100%;

    font-size:  16px;
    box-sizing: border-box;
    .wrapper-createRequest-header {
      .toolbar {
        height: 60px;
      }
    }
    .wrapper-createRequest-content {
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      height: calc(~"100% - 60px");
      .wrapper-createRequest-middle {
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
                  font-size: 16px;
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
                width: 100%;
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
        .right {
          width: @rightWidth;
          position: relative;
          header {
            height: @contacts-header-height;
            padding: 21px 0;
            box-sizing: border-box;
            .btn-select, .btn-all, .btn-filter {
              display: inline-block;
              font-size: 14px;
            }
            .btn-select {
              width: 96px;
              height: 30px;
              line-height: 30px;
              color: #ffffff;
              background-color: #9aa1ae;
              text-align: center;
              border-radius: 0px 15px 15px 0px;
            }
            .btn-all, .btn-filter {
              float: right;
              width: 68px;
              height: 28px;
              line-height: 28px;
              border: 1px solid #9AA1AE;
              border-radius: 4px;
              text-align: center;
              margin-right: 20px;
              cursor: pointer;
            }
            .btn-all {
              .icon {
                display: inline-block;
                margin-right: 3px;
                img {
                  width: 18px;
                  height: 14px;
                  vertical-align: sub;
                }
              }
            }
            .btn-filter {
              &.on {
                color: #477CBE;
                border: 1px solid #477CBE;
              }
            }
          }
          .peoples {
            padding: 10px 30px;
            box-sizing: border-box;
            font-size: 12px;
            overflow: hidden;
            .people {
              float: left;
              position: relative;
              width: calc(~"(100% + 43.8px) / 5");
              &:nth-child(5n) {
                width: 50px;
                overflow: hidden;
                .del {
                  right: 0;
                }
              }
              .info, .nextstep {
                float: left;
              }
              .info {
                width: 50px;
                .avatar {
                  margin-top: 6px;
                  width: 50px;
                  height: 50px;
                  border-radius: 50%;
                  display: block;
                }
                .name {
                  margin-top: 6px;
                  height: 14px;
                  line-height: 14px;
                  text-align: center;
                }
              }
              .nextstep {
                width: calc(~"100% - 50px");
                height: 70px;
                text-align: center;
                padding: 25px 0;
                box-sizing: border-box;
              }
              .del {
                position: absolute;
                top: 0px;
                right: 46px;
                width: 14px;
                height: 14px;
                line-height: 12px;
                border: 1px solid #E6E9ED;
                color: #9AA1AE;
                background-color: #FFFFFF;
                border-radius: 50px;
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                transform: rotate(45deg);
                cursor: pointer;
                z-index: 1;
              }
              &:hover {
                .del {
                  color: #FFFFFF;
                  background-color: red;
                }
              }
            }
            .add {
              float: left;
              height: 70px;
              padding: 10px 0;
              box-sizing: border-box;
              .btn-add {
                width: 48px;
                height: 48px;
                line-height: 48px;
                text-align: center;
                border-radius: 50%;
                font-size: 14px;
                border: 1px solid #D7DADF;
                cursor: pointer;
                &:hover {
                  color: #477CBE;
                  border: 1px solid #477CBE;
                }
              }
            }
          }
          .zc-slide-content {
            .wrapper {
              width: 100%;
              position: absolute;
              padding: 20px;
              padding-bottom: 10px;
              box-sizing: border-box;
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
              .list {
                margin-top: 20px;
                font-size: 12px;
                .item {
                  display: inline-block;
                  margin-bottom: 10px;
                  .name {
                    color: #9AA1AE;
                    position: relative;
                    border: 1px solid #D7DADF;
                    margin-right: 10px;
                    border-radius: 4px;
                    padding: 6px 8px;
                    &:hover {
                      .del {
                        color: #FFFFFF;
                        background-color: red;
                      }
                    }
                    .del {
                      position: absolute;
                      top: -6px;
                      right: -6px;
                      width: 14px;
                      height: 14px;
                      line-height: 12px;
                      border: 1px solid #E6E9ED;
                      color: #9AA1AE;
                      background-color: #FFFFFF;
                      border-radius: 50px;
                      text-align: center;
                      font-size: 16px;
                      font-weight: bold;
                      transform: rotate(45deg);
                      cursor: pointer;
                    }
                  }
                }
              }
            }
            .el-tree {
              margin-top: 167px;
              height: calc(~"100% - 187px");
              overflow: auto;
            }
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
      width: calc(~"100% - 56px");
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
        .el-checkbox {
          float: left;
          margin-left: 23px !important;
          margin-right: -17px !important;
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
