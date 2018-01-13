<template lang="pug">
  #approve
    .public-form-title
      span
        | 审批信息
    el-row(:gutter="60")
      el-col(:span="24")
        el-form-item
          el-button.check(size="small", :class="{'on': info.audit === 0}", :icon="info.audit === 0 ? 'check' : ''")
            | 未审核
          el-button.check(size="small", :class="{'on': info.audit === 2}", :icon="info.audit === 2 ? 'check' : ''")
            | 通过
          el-button.check(size="small", :class="{'on': info.audit === 3}", :icon="info.audit === 3 ? 'check' : ''")
            | 拒绝通过
      el-col(:span="24")
        el-form-item(label="审批意见")
        c-input(placeholder="请输入审批意见（200字以内）", :max="200", v-model="info.auditOpinion", disabled="disabled")
</template>

<script>
  import CInput from '../../../../common/input/cInput.vue'
  import { mapActions } from 'vuex'
  export default {
    name: '',
    components: {
      CInput
    },
    data () {
      return {
        info: {},
        approveFn: null
      }
    },
    created () {
    },
    destroyed () {
    },
    mounted () {
    },
    computed: {
    },
    methods: {
      ...mapActions(['goBack', 'loadGetMatchmaker', 'auditMatchmaker']),
      init (info) {
        this.info = info
      }
    }
  }
</script>

<style lang="less">
  @import "./common";
</style>
