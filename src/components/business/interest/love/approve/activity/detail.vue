<template lang="pug">
  #activity-detail.wrapper-content
    c-header(:menuNames="menuNames")
      .goback(slot='right')
        img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    .wrapper-list-content
      .wrapper-list-middle
        .public-form-box
          .public-form-content
            el-form.public-form
              .public-form-title(v-if="!lookDetail")
                span
                  | 活动信息
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="活动图片:", prop="name")
                  .bar-idcard(v-if="info.pictures")
                    c-check-image-list(v-if="info.pictures", :images="info.pictures", :isBig="true")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="活动名称：", prop="name")
                    el-input(v-model="info.name", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="报名人数：", prop="total")
                    el-input(v-model="info.total", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="报名时间:", prop="name")
                    el-input(v-model="info.entryTime", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="活动时间:", prop="name")
                    el-input(v-model="info.activityTime", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="活动权限:", prop="name")
                    el-checkbox(v-model="info.entry",disabled)
                      | 仅认证会员可报名
                el-col(:span="12")
                  el-form-item(label="活动地址:", prop="place")
                    el-input(v-model="info.place", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="活动详情:", prop="detail", style="margin-bottom: 0px;")
                  .textarea(disabled="disabled", v-html="info.detail")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="规则介绍:", prop="rule", style="margin-bottom: 0px;")
                  .textarea(disabled="disabled", v-html="info.rule")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="附件:", prop="name", style="margin-bottom: 0px;")
                  c-attachment-list(:attachments="info.files")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="发起单位:", prop="name")
                    el-input(v-model="info.sponsor", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="负责人:", prop="name")
                    el-input(v-model="info.chargePerson", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="联系电话:", prop="name")
                    el-input(v-model="info.phone", disabled="disabled")
              c-approve(v-if="!lookDetail", ref="c-approve")
</template>

<script>
  import CHeader from '../../../../../common/header/cHeader.vue'
  import CApprove from '../../common/cApprove.vue'
  import CInput from '../../../../../common/input/cInput.vue'
  import CAttachmentList from '../../../../../office/common/cAttachmentList.vue'
  import CCheckImageList from '../../../../../office/common/cCheckImageList.vue'
  import filters from '../../../../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'namelistActivity',
    components: {
      CHeader,
      CApprove,
      CInput,
      CAttachmentList,
      CCheckImageList
    },
    data () {
      return {
        menuNames: [
          {
            name: '审批详情',
            route: '',
            on: true
          }
        ],
        options: [],
        info: {
          name: '',
          phone: '',
          activityTime: null,
          entryTime: null,
          entry: false,
          audit: null,
          files: []
        }
      }
    },
    created () {
      this.resetPage()
    },
    destroyed () {
    },
    mounted () {
      if (this.lookDetail) {
        this.menuNames[0].name = '活动详情'
      }
      this.loadData(this.$route.params.id)
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'goBack', 'loadGetHLActivity', 'auditHLActivity']),
      loadData (id) {
        this.loadGetHLActivity(id).then((data) => {
          this.info = data
          this.info.activityTime = new Date(data.start).Format('yyyy-MM-dd hh:mm') + '---' + new Date(data.end).Format('yyyy-MM-dd hh:mm')
          this.info.entryTime = new Date(data.entryStart).Format('yyyy-MM-dd hh:mm') + '---' + new Date(data.entryEnd).Format('yyyy-MM-dd hh:mm')
          this.info.entry = this.entryTypeFilter(data.entry)
          if (!this.lookDetail) {
            this.$refs['c-approve'].init(this.info, this.auditHLActivity)
          }
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../../common/common";
</style>
