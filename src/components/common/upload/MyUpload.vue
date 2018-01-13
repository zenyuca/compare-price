<!--<template>-->
  <!--<div class="my_upload">-->
    <!--<el-upload-->
      <!--:action="action"-->
      <!--:http-request="upload"-->
      <!--:on-success="success"-->
      <!--:file-list="list"-->
      <!--:list-type="type"-->
      <!--:on-preview="preview"-->
      <!--:before-upload="beforeUpload"-->
      <!--:on-remove="remove">-->
      <!--<i class="el-icon-plus"></i>-->
    <!--</el-upload>-->
    <!--<el-dialog v-model="showPic" size="tiny">-->
      <!--<img width="100%" :src="picUrl" alt="活动配图">-->
    <!--</el-dialog>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import { mapGetters, mapActions } from 'vuex'-->
  <!--import { warning } from '../../actions'-->
  <!--export default {-->
    <!--data () {-->
      <!--return {-->
        <!--list: [],-->
        <!--picUrl: '',-->
        <!--showPic: false,-->
        <!--first: true-->
      <!--}-->
    <!--},-->
    <!--props: {-->
      <!--filed: {-->
        <!--type: String,-->
        <!--default: 'files'-->
      <!--},-->
      <!--files: {-->
        <!--type: Array,-->
        <!--default: () => []-->
      <!--},-->
      <!--type: {-->
        <!--type: String,-->
        <!--default: 'picture-card'-->
      <!--},-->
      <!--edit: Boolean-->
    <!--},-->
    <!--computed: {-->
      <!--...mapGetters(['action'])-->
    <!--},-->
    <!--watch: {-->
      <!--files (val) {-->
        <!--if (this.first && !this.edit) {-->
          <!--val.forEach((v) => this.list.push({...v}))-->
        <!--}-->
        <!--this.first = false-->
      <!--}-->
    <!--},-->
    <!--methods: {-->
      <!--...mapActions(['upload', 'setList', 'delFile']),-->
      <!--success (data) {-->
        <!--this.setList({key: this.filed, data})-->
        <!--this.list = [...this.list, {...data}]-->
      <!--},-->
      <!--beforeUpload (file) {-->
        <!--if (this.type !== 'text' && file.size >= 1024 * 1024) {-->
          <!--warning('图片大小不能超过1M！请修改后重新上传！')-->
          <!--return false-->
        <!--}-->
        <!--return true-->
      <!--},-->
      <!--remove (file) {-->
        <!--if (file) {-->
          <!--const idx = this.list.findIndex(({url}) => url === file.url)-->
          <!--this.delFile([this.filed, idx])-->
          <!--this.list.splice(idx, 1)-->
        <!--}-->
      <!--},-->
      <!--preview ({url}) {-->
        <!--this.picUrl = url-->
        <!--this.showPic = true-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style lang="less">-->
  <!--.my_upload .el-upload&#45;&#45;text {-->
    <!--display: inline-block;-->
    <!--width: 36px;-->
    <!--border-radius: 3px;-->
    <!--border: 1px solid #d9d9d9;-->
  <!--}-->

  <!--.my_upload .el-upload&#45;&#45;text:hover {-->
    <!--border-color: #20a0ff;-->
  <!--}-->
<!--</style>-->
