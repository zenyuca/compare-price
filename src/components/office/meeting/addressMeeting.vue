<template lang="pug">
  #addressMeeting.wrapper-content
    c-header.wrapper-addressMeeting-header(:menuNames="menuNames")
    .wrapper-addressMeeting-content
      .wrapper-addressMeeting-middle
        .left
          .wrapper-row
            .row
              header
                | 会议地址管理
              .wrapper.box-input(v-for="param in params", :class="{'has-content': param.text}")
                input(placeholder="请输入回复内容", v-model="param.text")
                .icon(@click="delParam(param)")
                  img(src="../common/icon/icon-del.png")
              .btn-add(@click="addParam()")
                | + 添加
          .wrapper-btn-bar
            .btn.btn-create.on(@click="publish")
              | 提交
</template>

<script>
  import CHeader from '../../common/header/cHeader.vue'
  import CInput from '../../common/input/cInput.vue'
  import CUploadAttchment from '../common/cUploadAttchment.vue'
  import Modal from '../../common/modal/modal.vue'
  import { mapGetters, mapActions } from 'vuex'
  import filters from '../../../core/filters'
  import _ from 'lodash'
  import { uuid } from '../../../core/utils/tool'

  export default {
    name: 'addressMeeting',
    components: {
      CHeader,
      CInput,
      CUploadAttchment,
      Modal
    },
    data () {
      return {
        menuNames: [
          {
            name: '参数设置',
            route: '',
            on: true
          }
        ],
        params: []
      }
    },
    watch: {
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
      this.loadData()
    },
    mounted () {
      this.cUploadAttchment = this.$refs['c-upload-attchment']
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['addConfigure', 'loadConfigure']),
      delParam (reply) {
        let list = _.cloneDeep(this.params)
        _.remove(list, (e) => {
          if (e.id === reply.id) {
            return true
          }
        })
        this.params = list
      },
      addParam () {
        let list = this.params
        let reply = {
          id: uuid(),
          value: ''
        }
        list.push(reply)
      },
      loadData () {
        let type = 3
        this.loadConfigure(type).then((data) => {
          this.params = data
        })
      },
      publish () {
        let configures = []
        for (let item of this.params) {
          let configure = {
            type: 3,
            text: item.text
          }
          configures.push(configure)
        }
        this.addConfigure(configures).then((data) => {
          this.$alert(`提交成功`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
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
  @rightWidth: 0px;

  #addressMeeting {
    width: 100%;
    height: 100%;

    font-size: 16px;
    box-sizing: border-box;
    .wrapper-addressMeeting-header {
      .toolbar {
        height: 60px;
      }
    }
    .wrapper-addressMeeting-content {
      padding: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      height: calc(~"100% - 60px");
      .wrapper-addressMeeting-middle {
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
      }
    }
  }
</style>
