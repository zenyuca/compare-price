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
                  | 红娘信息
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="姓名:", prop="name")
                    el-input(v-model="info.name", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="性别:", prop="sexInfo")
                    el-input(v-model="info.sexInfo", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="联系电话:", prop="phone")
                    el-input(v-model="info.phone", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="身份证号:", prop="cardNo")
                    el-input(v-model="info.cardNo", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="身份证:", prop="cardNo")
                  .bar-idcard
                    c-check-image-list(v-if="info.files", :images="info.files", :isBig="true")
              c-approve(v-if="!lookDetail", ref="c-approve")
              c-approve-detail(v-if="lookDetail", ref="c-approve-detail")
</template>

<script>
  import CHeader from '../../../../../common/header/cHeader.vue'
  import CApprove from '../../common/cApprove.vue'
  import CApproveDetail from '../../common/cApproveDetail.vue'
  import CCheckImageList from '../../../../../office/common/cCheckImageList.vue'
  import filters from '../../../../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'namelistActivity',
    components: {
      CHeader,
      CApprove,
      CApproveDetail,
      CCheckImageList
    },
    props: {
      lookDetail: {
        type: Boolean,
        default: false
      }
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
      ...mapActions(['resetPage', 'goBack', 'loadGetMatchmaker', 'auditMatchmaker']),
      loadData (id) {
        this.loadGetMatchmaker(id).then((data) => {
          this.info = data
          this.info.sexInfo = this.sexFilter(data.sex)
          if (this.lookDetail) {
            this.$refs['c-approve-detail'].init(this.info)
          } else {
            this.$refs['c-approve'].init(this.info, this.auditMatchmaker)
          }
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../../common/common";
</style>
