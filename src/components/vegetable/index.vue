<template lang="pug">
  #index.wrapper-content
    .content
      | 欢迎来到比价管理系统
</template>

<script>
  import CHeader from '../common/header/cHeader.vue'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'namelistActivity',
    components: {
      CHeader
    },
    data () {
      return {
      }
    },
    created () {
    },
    mounted () {
    },
    destroyed () {
    },
    computed: {
      ...mapGetters(['getPage', 'getAccount'])
    },
    methods: {
      ...mapActions(['loadHLActivity', 'deleteHLActivity', 'goBack', 'updateHLDeptPwd']),
      loadData () {
      }
    }
  }
</script>

<style lang="less">
  #index {
    .content {
      text-align: center;
      width: 100%;
      font-size: 24px;
      letter-spacing: 2px;
      padding-top: 200px;
    }
  }
</style>
