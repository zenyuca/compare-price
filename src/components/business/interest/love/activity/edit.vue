<template lang="pug">
  #redgirl-detail.wrapper-content
    c-header.wrapper-namelistNotice-header(:menuNames="menuNames")
      .goback(slot='right')
        img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    .wrapper-list-content
      .wrapper-list-middle
        .public-form-box
          .public-form-content
            el-form.public-form
              .public-form-title
                span
                  | 活动信息
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="活动图片：", prop="cardNo")
                  el-upload(ref="upload", :file-list="activity.pictures", :on-success="onSuccess", :on-remove="handleRemove", :action="uploadUrl", list-type="picture-card", :on-preview="handlePictureCardPreview", style="margin-bottom: 20px;")
                    i.el-icon-plus
                  el-dialog(v-model="dialogVisible", size="tiny")
                    img(width="100%", :src="dialogImageUrl", alt="")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="活动名称：", prop="name")
                    el-input(v-model="activity.name", placeholder="请输入（40字以内）", :maxlength="40")
                el-col(:span="12")
                  el-form-item(label="报名人数：", prop="total")
                    el-input(v-model="activity.total", placeholder="请输入报名人数")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="报名时间：", prop="activityEntryTimeRange", style="margin-bottom: 0")
                  el-date-picker(v-model="activityEntryTimeRange", placeholder="报名日期", type="datetimerange",range-separator=" 至 ",start-placeholder="开始日期",end-placeholder="结束日期", style="margin-bottom: 20px; width: 100%;")
                el-col(:span="12")
                  el-form-item(label="活动时间：", prop="activityTimeRange", style="margin-bottom: 0")
                  el-date-picker(v-model="activityTimeRange", placeholder="活动日期", type="datetimerange",range-separator=" 至 ",start-placeholder="开始日期",end-placeholder="结束日期", style="margin-bottom: 20px; width: 100%;")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="报名权限：", prop="entry", style="margin-bottom: 0")
                  el-radio(v-model="activity.entry", label="1", style="margin-bottom: 20px;")
                    | 仅认证会员可报名
                  el-radio(v-model="activity.entry", label="0", style="margin-bottom: 20px;")
                    | 所有用户可报名
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="所需积分：", prop="score")
                    el-input(v-model="activity.score", placeholder="请输入所需积分",disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="主办方：", prop="sponsor")
                    el-input(v-model="activity.sponsor", placeholder="请输入主办方")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="协办方：", prop="coSponsor")
                    el-input(v-model="activity.coSponsor", placeholder="请输入协办方")
                el-col(:span="12")
                  el-form-item(label="承办方：", prop="organizer")
                    el-input(v-model="activity.organizer", placeholder="请输入承办方")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="活动地址：", prop="place")
                    el-input(v-model="activity.place", placeholder="请输入活动地址")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="活动详情：", prop="cardNo", style="margin-bottom: 0")
                  u-editor(ref="ueditor-detail", :content="activity.detail")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="规则介绍：", prop="cardNo", style="margin-bottom: 0")
                  u-editor(ref="ueditor-rule", :content="activity.rule")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="附件：", prop="cardNo")
                  c-upload-attchment(ref="c-upload-attchment", :hasDownload="true", style="margin-bottom: 20px", @getRemoveId="getRemoveId")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="发起单位：", prop="place")
                    el-input(v-model="activity.sponsor", placeholder="")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="负责人：", prop="score")
                    el-input(v-model="activity.chargePerson", placeholder="")
                el-col(:span="12")
                  el-form-item(label="联系电话：", prop="sponsor")
                    el-input(v-model="activity.phone", placeholder="")
              .public-form-title
                span
                  | 审批信息
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item
                    el-button.check(size="small", :class="{'on': activity.audit === 0}", :icon="activity.audit === 0 ? 'check' : ''")
                      | 未审核
                    el-button.check(size="small", :class="{'on': activity.audit === 2}", :icon="activity.audit === 2 ? 'check' : ''")
                      | 通过
                    el-button.check(size="small", :class="{'on': activity.audit === 3}", :icon="activity.audit === 3 ? 'check' : ''")
                      | 拒绝通过
                el-col(:span="24")
                  el-form-item(label="审批意见")
                  c-input(placeholder="请输入审批意见（200字以内）", :max="200", v-model="activity.auditOpinion", disabled="disabled")
              .posb
                el-button.submit(@click="edit")
                  | 提交
</template>

<script>
  import CHeader from '../../../../common/header/cHeader.vue'
  import UEditor from '../../../../common/ueditor/ueditor.vue'
  import CInput from '../../../../common/input/cInput.vue'
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
      UEditor,
      CInput
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
        activityTimeRange: [],
        activityEntryTimeRange: [],
        options: [],
        activity: {
          name: '',
          audit: null,
          auditOpinion: '',
          total: null,
          entry: '0',
          place: '',
          files: [],
          pictures: []
        },
        delFiles: [],
        dialogVisible: false,
        dialogImageUrl: ''
      }
    },
    created () {
    },
    destroyed () {
    },
    mounted () {
      this.loadData(this.$route.params.id)
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['goBack', 'loadGetHLActivity', 'updateHLActivity']),
      loadData () {
        this.loadGetHLActivity(this.$route.params.id).then((data) => {
          this.activity = data
          this.activity.auditOpinion = this.activity.auditOpinion || ''
          this.activityEntryTimeRange.push(this.activity.entryStart)
          this.activityEntryTimeRange.push(this.activity.entryEnd)
          this.activityTimeRange.push(this.activity.start)
          this.activityTimeRange.push(this.activity.end)
          this.activity.entry = this.activity.entry + ''
          this.$refs['c-upload-attchment'].setFileList(this.activity.files)
          this.info = data
          this.info.activityTime = new Date(data.start).Format('yyyy-MM-dd hh:mm') + '---' + new Date(data.end).Format('yyyy-MM-dd hh:mm')
          this.info.entryTime = new Date(data.entryStart).Format('yyyy-MM-dd hh:mm') + '---' + new Date(data.entryEnd).Format('yyyy-MM-dd hh:mm')
        })
      },
      edit () {
        this.activity.entryStart = this.activityEntryTimeRange[0]
        this.activity.entryEnd = this.activityEntryTimeRange[1]
        this.activity.start = this.activityTimeRange[0]
        this.activity.end = this.activityTimeRange[1]
        this.activity.files = this.$refs['c-upload-attchment'].getFileList()
        this.activity.detail = this.$refs['ueditor-detail'].getUEContent()
        this.activity.rule = this.$refs['ueditor-rule'].getUEContent()
        this.activity.delFiles = this.delFiles
        for (let item of this.activity.pictures) {
          item.status = 1
        }
        this.updateHLActivity(this.activity).then((data) => {
          alert('修改成功')
        })
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleRemove (file, files) {
        this.getRemoveId(file.id)
        let id = file.id || file.response.data.id
        this.activity.pictures = _.remove(this.activity.pictures, (e) => {
          return e.id !== id
        })
      },
      getRemoveId (id) { // 获取删除 文件id
        let o = {
          id: id,
          status: 2
        }
        this.delFiles.push(o)
      },
      // 上传成功
      onSuccess (response, file, files) {
        this.activity.pictures.push(response.data)
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
