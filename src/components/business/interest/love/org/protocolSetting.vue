<template lang="pug">
  #createProtocol.wrapper-content
    c-header.wrapper-namelistNotice-header(:menuNames="menuNames")
    .wrapper-list-content
      .wrapper-list-middle
        .list
          u-editor(ref="ueditor")
        .btn-bar
          el-button(type="primary", @click="submit")
            | 提交
</template>

<script>
  import CHeader from '../../../../common/header/cHeader.vue'
  import filters from '../../../../../core/filters/index'
  import UEditor from '../../../../common/ueditor/ueditor.vue'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'namelistActivity',
    components: {
      CHeader,
      UEditor
    },
    data () {
      return {
        menuNames: [
          {
            name: '协议配置',
            route: '',
            on: true
          }
        ]
      }
    },
    created () {
    },
    destroyed () {
    },
    mounted () {
      this.$nextTick(() => {
        this.loadData()
      })
    },
    computed: {
      ...mapGetters(['getShareData'])
    },
    methods: {
      ...filters,
      ...mapActions(['getProtocol', 'updateProtocol']),
      loadData () {
        this.$refs['ueditor'].setUEContent(this.getShareData.exportProtocol)
      },
      submit () {
        let content = this.$refs['ueditor'].getUEContent()
        this.updateProtocol(content).then((data) => {
          this.getShareData.exportProtocol = this.$refs['ueditor'].getUEContent()
          this.$alert(`修改成功`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }).catch((data) => {
          alert(data.msg)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../love/common/common";
  .btn-bar {
    .el-button {
      float: right;
      margin-right: 25px;
      width: 180px;
    }
  }
</style>
