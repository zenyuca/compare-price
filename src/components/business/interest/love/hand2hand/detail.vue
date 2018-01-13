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
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="照片:", prop="name")
                  .bar-idcard
                    img(src="/static/image/avatar-boy.jpg")
                    img(src="/static/image/avatar-boy.jpg")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="姓名:", prop="name")
                    el-input(v-model="info.name", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="昵称:", prop="name")
                    el-input(v-model="info.sex", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="性别:", prop="name")
                    el-input(v-model="info.phone", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="联系电话:", prop="name")
                    el-input(v-model="info.idcard", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="出生日期:", prop="name")
                    el-input(v-model="info.phone", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="婚姻状况:", prop="name")
                    el-input(v-model="info.idcard", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="学历:", prop="name")
                    el-input(v-model="info.phone", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="户籍:", prop="name")
                    el-input(v-model="info.idcard", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="身高:", prop="name")
                    el-input(v-model="info.phone", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="收入:", prop="name")
                    el-input(v-model="info.idcard", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="购房:", prop="name")
                    el-input(v-model="info.phone", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="购车:", prop="name")
                    el-input(v-model="info.idcard", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="自我介绍:", prop="name")
                  .textarea(contenteditable="true", disabled="disabled")
                    | {{ info.idcard }}
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
            name: '单身信息详情',
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
      this.loadData(this.$route.params.id)
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
      loadData (id) {
        alert(id)
      }
    }
  }
</script>

<style lang="less">
  @import "../common/common";
  #redgirl-detail {
    .bar-idcard {
      width: 100%;
      margin-bottom: 20px;
      img {
        width: 320px;
        height: 180px;
        border-radius: 4px;
        margin-right: 20px;
      }
    }
  }
</style>
