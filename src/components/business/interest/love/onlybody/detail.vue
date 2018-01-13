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
                el-col(:span="12")
                  el-form-item(label="姓名:", prop="name")
                    el-input(v-model="info.name", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="昵称:", prop="sexInfo")
                    el-input(v-model="info.sexInfo", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="性别:", prop="cardNo")
                  el-radio.radio(v-model="info.sexInfo")
                    | 男
                  el-radio.radio(v-model="info.sexInfo")
                    | 女
                el-col(:span="12")
                  el-form-item(label="联系电话:", prop="phone")
                    el-input(v-model="info.phone", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="出生日期:", prop="sexInfo")
                    el-input(v-model="info.sexInfo", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="婚姻状况:", prop="sexInfo")
                    el-input(v-model="info.sexInfo", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="学历:", prop="sexInfo")
                    el-input(v-model="info.sexInfo", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="户籍:", prop="sexInfo")
                    el-input(v-model="info.sexInfo", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="身高:", prop="sexInfo")
                    el-input(v-model="info.sexInfo", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="收入:", prop="sexInfo")
                    el-input(v-model="info.sexInfo", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="购房:", prop="sexInfo")
                  el-checkbox(v-model="info", disabled="disabled")
                    | 已购房
                el-col(:span="12")
                  el-form-item(label="购车:", prop="sexInfo")
                  el-checkbox(v-model="info", disabled="disabled")
                    | 已购车
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="自我介绍:", prop="sexInfo")
                    el-input(v-model="info", disabled="disabled")

</template>

<script>
  import CHeader from '../../../../common/header/cHeader.vue'
  import filters from '../../../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'namelistActivity',
    components: {
      CHeader
    },
    props: {
    },
    data () {
      return {
        menuNames: [
          {
            name: '单身信息详情',
            route: '',
            on: true
          }
        ],
        options: [],
        info: {
          name: '',
          sex: '',
          sexInfo: '',
          phone: '',
          cardNo: '',
          audit: null,
          auditOpinion: '',
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
      this.loadData(this.$route.params.id)
    },
    computed: {
      ...mapGetters(['getPage'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'goBack', 'loadGetMatchmaker', 'auditMatchmaker']),
      loadData (id) {
        this.loadGetMatchmaker(id).then((data) => {
          this.info = data
          this.info.sexInfo = this.sexFilter(data.sex)
          if (!this.lookDetail) {
            this.$refs['c-approve'].init(this.info, this.auditMatchmaker)
          }
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../common/common";
</style>
