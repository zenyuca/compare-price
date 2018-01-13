<template lang="pug">
  #redgirl-detail.wrapper-content
    c-header.wrapper-namelistNotice-header(:menuNames="menuNames")
    .wrapper-list-content
      .wrapper-list-middle
        .public-form-box
          .public-form-content
            el-form.public-form
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="报名所需积分:", prop="name")
                    el-input(v-model="info.name")
                el-col(:span="12")
                  el-form-item(label="签到奖励积分:", prop="name")
                    el-input(v-model="info.sex")
              .posb
                el-button.submit
                  | 提交
</template>

<script>
  import CHeader from '../../../../common/header/cHeader.vue'
  import CPage from '../../../../common/page/cPage.vue'
  import CInput from '../../../../common/input/cInput.vue'
  import { bindTableWhellEvent, fixedHeight } from '../../../../../core/utils/event'
  import filters from '../../../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'namelistActivity',
    components: {
      CHeader,
      CPage,
      CInput
    },
    data () {
      return {
        currentPage: 1,
        menuNames: [
          {
            name: '配置管理',
            route: '',
            on: true
          }
        ],
        options: [],
        info: {
          name: '李湘',
          sex: '女',
          phone: '13454131234',
          idcard: '201124199804211234'
        }
      }
    },
    created () {
      this.resetPage()
      this.loadData()
    },
    destroyed () {
    },
    mounted () {
      this.$nextTick(() => {
        bindTableWhellEvent()
        fixedHeight()
      })
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'goBack']),
      loadData () {
      }
    }
  }
</script>

<style lang="less">
  @import "../common/common";
</style>
