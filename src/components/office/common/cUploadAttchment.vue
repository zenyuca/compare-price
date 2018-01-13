<template lang="pug">
  #cUploadAttachment
    ul.files
      li.file(v-for="file in fileList")
        .avatar
          img(src="./icon/icon-pdf.png")
        .content-file(:class="{'hasDownload': hasDownload}")
          .name
            | {{file.name}}
          .size
            | {{file.size}}
        a.btn.btn-download(:href="file.url", target="_blank", v-if="hasDownload")
          img(src="./icon/icon-download.png")
        .btn.btn-del(@click="delUploadFile(file)", v-if="!hiddenBtn")
          img(src="./icon/icon-del.png")
    .btn-add.btn-upload(v-if="!hiddenBtn")
      span
        | 上传附件
      input(id="input-file", type="file", accept="application/pdf", @change="uploadAttachment($event)")
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import filters from '../../../core/filters'
  import _ from 'lodash'

  export default {
    name: 'cUploadAttachment',
    components: {},
    beforeRouteEnter (to, from, next) {
      next()
    },
    props: {
      hiddenBtn: {
        type: [Boolean, String],
        default: false
      },
      hasDownload: {
        type: [Boolean, String],
        default: false
      }
    },
    data () {
      return {
        fileList: []
      }
    },
    created () {
    },
    mounted () {
    },
    computed: {
      ...mapGetters(['getAccount'])
    },
    methods: {
      ...filters,
      ...mapActions(['uploadFile']),
      getFileList () {
        return this.fileList
      },
      setFileList (fileList) {
        this.fileList = fileList
      },
      cleanFileList () {
        this.fileList = []
      },
      uploadAttachment (event) {
        let max = 6
        if (this.fileList.length >= max) {
          this.$alert(`附件最多上传${max}个`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          return
        }
        let element = event.currentTarget
        let formData = new FormData()
        formData.append('file', element.files[0])
        this.uploadFile(formData).then((data) => {
          this.fileList.push({
            id: data.id,
            name: `${data.name}.${data.suffix}`,
            url: data.url,
            fileSize: data.fileSize,
            size: this.calcFileSizeFileter(data.fileSize)
          })
        })
      },
      delUploadFile (file) {
        let element = document.getElementById('input-file')
        element.value = ''
        this.fileList = _.remove(this.fileList, (n) => {
          return n.id !== file.id
        })
        this.$emit('getRemoveId', file.id)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/less/common";

  #cUploadAttachment {
    .files {
      width: 100%;
      .file {
        width: calc(~"(100% - 66px) / 3");
        height: 54px;
        display: inline-block;
        margin-right: 30px;
        margin-bottom: 16px;
        border: 1px solid #DDDDDD;
        &:nth-child(3n+0) {
          margin-right: 0px;
        }
        .avatar, .content-file, .btn-del {
          float: left;
          height: inherit;
        }
        .avatar {
          width: 51px;
          img {
            margin-left: 13px;
            margin-top: 12px;
          }
        }
        .content-file {
          width: calc(~"100% - 101px");
          &.hasDownload {
            width: calc(~"100% - 151px");
          }
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

        .btn-del, .btn-download {
          width: 50px;
          display: inline-block;
          float: left;
          img {
            margin-left: 20px;
            margin-top: 20px;
          }
        }
        .btn-download {
          img {
            margin-top: 18px;
          }
        }
      }
    }
    .btn-upload {
      position: relative;
      display: inline-block;
      overflow: hidden;
      width: 128px;
      height: 38px;
      line-height: 38px;
      border-radius: 4px;
      border: 1px solid #DDDDDD;
      color: #4D4D4D;
      background-color: #F0F0F0;
      text-align: center;
      cursor: pointer;
      input {
        position:absolute;
        right: 0px;
        top: 0px;
        opacity: 0;
        -ms-filter: 'alpha(opacity=0)';
        font-size: 200px;
        cursor: pointer;
      }
    }
  }
</style>
