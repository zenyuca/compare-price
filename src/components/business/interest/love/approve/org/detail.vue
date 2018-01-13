<template lang="pug">
  #org-detail.wrapper-content
    c-header(:menuNames="menuNames")
      .goback(slot='right')
        img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    .wrapper-list-content
      .wrapper-list-middle
        .public-form-box
          .public-form-content
            el-form.public-form
              .public-form-title
                span
                  | 机构信息
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="机构名称：", prop="name")
                    el-input(v-model="info.name", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="三证合一码（或组织机构代码）:", prop="organizCode")
                    el-input(v-model="info.organizCode", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="负责人:", prop="chargePerson")
                    el-input(v-model="info.chargePerson", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="联系电话:", prop="phone")
                    el-input(v-model="info.phone", disabled="disabled")
              el-row(:gutter="60")
                el-col(:span="24")
                  el-form-item(label="营业执照:", prop="name", style="margin-bottom: 0")
                  .bar-zhizhao(style="margin-bottom: 20px")
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
        currentPage: 1,
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
          organizCode: '',
          chargePerson: '',
          idcard: '',
          auditOpinion: '',
          files: []
        }
      }
    },
    created () {
      this.loadData()
    },
    destroyed () {
    },
    mounted () {
      this.menuNames[0].name = '机构详情'
    },
    computed: {
      ...mapGetters(['getPage', 'getAccount'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'goBack', 'loadGetHLDepartment']),
      loadData () {
        let id = this.getAccount.user.id
        this.loadGetHLDepartment(id).then((data) => {
          this.info = data
          if (this.lookDetail) {
            this.$refs['c-approve-detail'].init(this.info)
          } else {
            this.$refs['c-approve'].init(this.info, this.auditHLDepartment)
          }
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../../common/common";
  .bar-zhizhao {
    img {
      width: 600px;
      height: 1066px;
    }
  }
</style>
