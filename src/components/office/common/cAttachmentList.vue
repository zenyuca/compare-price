<template lang="pug">
  ul.attachments
    li.attachment(v-for="attachment in attachments")
      .avatar
        img(src="./icon/icon-pdf.png")
      .content-file
        .name
          | {{ attachment.name }}.{{ attachment.suffix }}
        .size
          | {{ calcFileSizeFileter(attachment.fileSize) }}
      a.download(:href="attachment.url", target="_blank")
        img(src="./icon/icon-download.png")
</template>

<script>
  import filters from '../../../core/filters'

  export default {
    name: '',
    components: {
    },
    props: {
      attachments: {
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
      ...filters
    }
  }
</script>

<style lang="less">
  @import "../../common/less/common";
  .attachments {
    color: #B0B0B0;
    font-size: 14px;
    .attachment {
      margin-top: 2px;
      height: 54px;
      .avatar, .content-file, .download {
        float: left;
        height: inherit;
      }
      .avatar {
        width: 37px;
        img {
          margin-top: 12px;
        }
      }
      .content-file {
        width: calc(~"100% - 63px");
        .name {
          margin-top: 14px;
          color: #4D4D4D;
          line-height: 14px;
          font-size: 14px;
          .ellipsis-mixin;
        }
        .size {
          margin-top: 4px;
          color: #CBD1DC;
          line-height: 12px;
          font-size: 12px;
        }
      }
      .download {
        line-height: 54px;
        float: right;
        text-decoration: none;
        color: #477CBE;
      }
    }
  }
</style>
