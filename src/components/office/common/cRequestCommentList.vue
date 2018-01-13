<!-- 请示评论列表 -->
<template lang="pug">
  ul.comments
    li.comment(v-for="comment in comments")
      .comment-info
        .avatar
          img(:src="comment.avatar")
        .name
          | {{ comment.name }}
        .action(:class="getClass(comment)")
          | {{ comment.action }}
        .time
          | {{ comment.time }}
      .msg
        | {{ comment.msg }}
</template>

<script>
  import filters from '../../../core/filters'

  export default {
    name: '',
    components: {
    },
    props: {
      comments: {
        type: Array,
        default () {
          return []
        }
      }
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
    },
    methods: {
      ...filters,
      getClass (comment) {
        let action = comment.agreeType
        if (action === 1) {
          return 'doing'
        } else if (action === 2) {
          return 'agreed'
        } else if (action === 3) {
          return 'no'
        } else {
          return ''
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../common/less/common";

  .comments {
    color: #B0B0B0;
    font-size: 14px;
    padding: 15px 0;
    box-sizing: border-box;
    .comment {
      &:last-child {
        .msg {
          padding-bottom: 0px;
          border-left: 1px solid transparent;
        }
      }
      .comment-info {
        height: 30px;
        color: #121212;
        .avatar, .name, .action, .time{
          float: left;
          line-height: 30px;
        }
        .avatar {
          img {
            .avatar-mixin(30px);
          }
        }
        .name, .action {
          margin-left: 15px;
        }
        .action {
          // 已同意
          &.agreed {
            color: #3DB88B;
          }
          // 审批中
          &.doing {
            color: #FB9926;
          }
          // 拒绝
          &.no {
            color: #F64D4D;
          }
        }
        .time {
          font-size: 12px;
          color: #CBD1DC;
          float: right;
        }
      }
      .msg {
        line-height: 25px;
        margin-left: 16px;
        border-left: 1px solid #CBD1DC;
        width: calc(~"100% - 16px");
        padding-left: 25px;
        box-sizing: border-box;
        padding-bottom: 15px;
      }
    }
  }
</style>
