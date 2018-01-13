<!-- 审批图片列表 -->
<template lang="pug">
  .request-image
    ul.images
      li(:class="{'image': !isBig, 'big-image': isBig}",v-for="image in images", title="点击预览", @click="handlePictureCardPreview(image.url)")
        img(:src="image.url")
    el-dialog(v-model="dialogVisible", size="tiny")
      img(width="100%", :src="dialogImageUrl", alt="")
</template>

<script>
  export default {
    name: '',
    components: {
    },
    props: {
      images: {
        type: Array,
        default () {
          return []
        }
      },
      isBig: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        dialogVisible: false,
        dialogImageUrl: ''
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
      handlePictureCardPreview (url) {
        this.dialogImageUrl = url
        this.dialogVisible = true
      }
    }
  }
</script>

<style lang="less">
  .request-image {
    margin-top: 5px;
    .images {
      overflow: hidden;
      img {
        border: 1px solid transparent;
        &:hover {
          border: 1px solid rgb(209, 216, 229);
        }
      }
      .image {
        width: 78.66px;
        height: 78.66px;
        margin-right: 10px;
        float: left;
        cursor: pointer;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &:nth-last-child(1), &:nth-last-child(2), &:nth-last-child(3) {
          margin-bottom: 0 !important;
        }
        img {
          width: 100%;
          height: 78.66px;
        }
      }
      .big-image {
        width: 142px;
        height: 142px;
        margin-right: 10px;
        float: left;
        cursor: pointer;
        img {
          width: 140px;
          height: 140px;
        }
      }
    }
  }
</style>
