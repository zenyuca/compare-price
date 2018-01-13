<template lang="pug">
  #redgirl-detail.wrapper-content
    c-header.wrapper-namelistNotice-header(:menuNames="menuNames")
      .goback(slot='right')
        img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    .wrapper-list-content
      .wrapper-list-middle
        .public-form-box
          .public-form-content
            el-form.public-form(:model="ruleForm",:rules="rules",ref="ruleForm")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="活动图片：", prop="cardNo")
                  el-upload(ref="upload", :on-success="onSuccess", :on-remove="handleRemove", :action="uploadUrl", list-type="picture-card", :on-preview="handlePictureCardPreview", style="margin-bottom: 20px;")
                    i.el-icon-plus
                  el-dialog(v-model="dialogVisible", size="small")
                    img(width="100%", :src="dialogImageUrl", alt="")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="活动名称：", prop="name")
                    el-input(v-model="ruleForm.name", placeholder="请输入（40字以内）", :maxlength="40")
                el-col(:span="12")
                  el-form-item(label="报名人数：", prop="total")
                    el-input(v-model="ruleForm.total", placeholder="请输入报名人数")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="报名时间：", prop="activityEntryTimeRange", style="margin-bottom: 0")
                  el-date-picker(v-model="ruleForm.activityEntryTimeRange", placeholder="报名日期", type="datetimerange",range-separator=" 至 ",start-placeholder="开始日期",end-placeholder="结束日期", style="margin-bottom: 20px; width: 100%;")
                el-col(:span="12")
                  el-form-item(label="活动时间：", prop="activityTimeRange", style="margin-bottom: 0")
                  el-date-picker(v-model="ruleForm.activityTimeRange", placeholder="活动日期", type="datetimerange",range-separator=" 至 ",start-placeholder="开始日期",end-placeholder="结束日期", style="margin-bottom: 20px; width: 100%;")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="报名权限：", prop="entry", style="margin-bottom: 0")
                  el-radio(v-model="ruleForm.entry", label="1", style="margin-bottom: 20px;")
                    | 仅认证会员可报名
                  el-radio(v-model="ruleForm.entry", label="0", style="margin-bottom: 20px;")
                    | 所有用户可报名
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="所需积分：", prop="score")
                    el-input(v-model="ruleForm.score", placeholder="请输入所需积分",disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="主办方：", prop="sponsor")
                    el-input(v-model="ruleForm.sponsor", placeholder="请输入主办方")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="协办方：", prop="coSponsor")
                    el-input(v-model="ruleForm.coSponsor", placeholder="请输入协办方")
                el-col(:span="12")
                  el-form-item(label="承办方：", prop="organizer")
                    el-input(v-model="ruleForm.organizer", placeholder="请输入承办方")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="活动地址：", prop="place")
                    el-input(v-model="ruleForm.place", placeholder="请输入活动地址")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="活动详情：", prop="cardNo", style="margin-bottom: 0")
                  u-editor(ref="ueditor-detail")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="规则介绍：", prop="cardNo", style="margin-bottom: 0")
                  u-editor(ref="ueditor-rule")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="附件：", prop="cardNo")
                  c-upload-attchment(ref="c-upload-attchment")
              .posb
                el-button.submit(type="primary", @click="submitForm('ruleForm')")
                  | 提交
</template>

<script>
  import CHeader from '../../../../common/header/cHeader.vue'
  import UEditor from '../../../../common/ueditor/ueditor.vue'
  import CUploadAttchment from '../../../../office/common/cUploadAttchment.vue'
  import config from '../../../../../core/config'
  import filters from '../../../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  import _ from 'lodash'
  export default {
    name: 'namelistActivity',
    components: {
      CHeader,
      CUploadAttchment,
      UEditor
    },
    data () {
      return {
        ...config,
        menuNames: [
          {
            name: '发起活动',
            route: '',
            on: true
          }
        ],
        dialogImageUrl: '',
        dialogVisible: false,
        options: [],
        ruleForm: {
          name: '',
          audit: null,
          auditOpinion: '',
          total: null,
          entry: '0',
          place: '',
          files: [],
          activityTimeRange: [],
          activityEntryTimeRange: []
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          total: [
            { required: true, message: '请输入报名人数', trigger: 'blur' },
            { min: 1, max: 4, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          activityEntryTimeRange: [
            { type: 'array', required: true, message: '请选择报名时间', trigger: 'change' }
          ],
          activityTimeRange: [
            { type: 'array', required: true, message: '请选择活动时间', trigger: 'change' }
          ]
        }
      }
    },
    created () {
    },
    destroyed () {
    },
    mounted () {
      if (this.lookDetail) {
        this.menuNames[0].name = '红娘详情'
      }
      this.loadData(this.$route.params.id)
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['goBack', 'createHLActivity', 'updateHLActivity']),
      loadData (id) {
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.entryStart = this.ruleForm.activityEntryTimeRange[0]
            this.ruleForm.entryEnd = this.ruleForm.activityEntryTimeRange[1]
            this.ruleForm.start = this.ruleForm.activityTimeRange[0]
            this.ruleForm.end = this.ruleForm.activityTimeRange[1]
            this.ruleForm.pictures = this.ruleForm.files
            this.ruleForm.files = this.$refs['c-upload-attchment'].getFileList()
            this.ruleForm.detail = this.$refs['ueditor-detail'].getUEContent()
            this.ruleForm.rule = this.$refs['ueditor-rule'].getUEContent()
            this.createHLActivity(this.ruleForm).then((data) => {
              this.$alert(`创建成功`, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.goBack()
                }
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleRemove (file, files) {
        let id = file.response.data.id
        this.ruleForm.files = _.remove(this.ruleForm.files, (e) => {
          return e.id !== id
        })
      },
      // 上传成功
      onSuccess (response, file, files) {
        this.ruleForm.files.push(response.data)
      }
    }
  }
</script>

<style lang="less">
  @import "../common/common";
  .edui-default {
    margin-bottom: 10px;
  }

</style>
