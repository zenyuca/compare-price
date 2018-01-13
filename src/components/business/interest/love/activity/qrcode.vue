<template lang="pug">
  #qrcode-list.wrapper-content
    c-header(:menuNames="menuNames")
      .goback(slot="right")
        img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    .wrapper-list-content
      .wrapper-list-middle
        .list
          .qrcode
            img(:src="ticket")
            .bar-btn
              .btn.btn-download
                a(:href="ticket", target="_blank")
                  | 下载
</template>

<script>
  import CHeader from '../../../../common/header/cHeader.vue'
  import CPage from '../../../../common/page/cPage.vue'
  import { bindTableWhellEvent, fixedHeight } from '../../../../../core/utils/event'
  import filters from '../../../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
//  import { redgirl, activity } from '../../../../../core/menu/menu3/business/interest'
  export default {
    name: 'namelistActivity',
    components: {
      CHeader,
      CPage
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    data () {
      return {
        ticket: '',
        menuNames: [
          {
            name: '签到二维码',
            route: '',
            on: true
          }
        ]
      }
    },
    created () {
      this.ticket = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + this.$route.params.id
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
      ...mapActions(['resetPage', 'loadMatchmaker', 'deleteMatchmaker', 'goBack']),
      loadData () {
      }
    }
  }
</script>

<style lang="less">
  @import "../common/common";

  @qrCodeWidth: 300px;
  @qrCodeHeight: 350px;
  @w: calc(~"100% - " @qrCodeWidth);

  #qrcode-list {
    .list {
      .qrcode {
        margin: 100px auto;
        width: @qrCodeWidth;
        height: @qrCodeHeight;
        img {
          width: @qrCodeWidth;
          height: @qrCodeWidth;
        }
        .bar-btn {
          height: 50px;
          line-height: 50px;
          padding: 9px 0;
          box-sizing: border-box;
          .btn-download {
            margin: 0 auto;
            border-radius: 4px;
            border: 1px solid;
            text-align: center;
            width: 100px;
            padding: 8px;
          }
        }
      }
    }
  }
</style>
