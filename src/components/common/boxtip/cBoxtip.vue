<template lang="pug">
  .cBoxtip
    el-popover(placement='bottom', trigger="click")
      .box-tip(v-if="user.memberDetailShow")
        .header-tip
          img.avatar(:src="user.memberDetail.avatar")
          .wrapper-info
            .name
              | {{ user.memberDetail.name }}
            .job
              | {{ user.memberDetail.po }}
            .dept
              | {{ user.memberDetail.deptName }}
        .footer-tip
          .phone
            img.icon(src="./icon/icon-mobile.png")
            span.number
              | {{ user.memberDetail.mobile }}
      img.btn(:class="{'comment-avatar': type === 1}", :src="user.avatar || user.headimgurl", slot="reference", @click="showInfo(user)")
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'cBoxtip',
    props: {
      user: {
        type: Object,
        default () {
          return {}
        }
      },
      type: {
        type: Number,
        deault: 0
      }
    },
    data () {
      return {
      }
    },
    watch: {
    },
    created () {
    },
    computed: {
    },
    methods: {
      ...mapActions(['loadMemberDetail']),
      showInfo (user) {
        let userId = user.createBy || user.userId
        this.loadMemberDetail(userId).then((data) => {
          user.memberDetail = data
          this.$set(user, 'memberDetailShow', true)
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../less/common";

  .cBoxtip {
    vertical-align: top;
    display: inline-block;
    img {
      width: 100%;
      border-radius: 50%;
    }
    .comment-avatar {
      .avatar-mixin(24px);
    }
  }

  .box-tip {
    border: 1px solid #E5E8EC;
    border-radius: 8px;
    background-color: #ffffff;
    width: 256px;
    padding: 20px 0;
    box-sizing: border-box;
    z-index: 100;
    .header-tip {
      padding: 0 10px;
      .avatar, .wrapper-info {
        display: inline-block;
      }
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 13px;
        float: left;
      }
      .wrapper-info {
        width: calc(~"100% - 53px");
        color: #9DA4B0;
        .name, .job {
          display: inline-block;
          line-height: 20px;
        }
        .name {
          color: #121212;
          margin-right: 10px;
        }
        .dept {
          line-height: 20px;
        }
      }
    }
    .footer-tip {
      margin: 20px;
      margin-bottom: 0;
      padding-top: 20px;
      box-sizing: border-box;
      border-top: 1px solid #E6E9ED;
      .phone {
        color: #121212;
        line-height: 29px;
        .icon, .number {
          display: inline-block;
        }
        .icon {
          vertical-align: sub;
          margin-right: 8px;
        }
      }
    }
  }
  .el-popover {
    width: auto;
    padding: 0;
    border-radius: 4px;
    border: none;
  }
</style>
