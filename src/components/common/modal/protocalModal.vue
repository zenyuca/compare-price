<template lang="pug">
  #protocalModal
    el-dialog(title="敏感资料导出申请协议", :visible.sync="dialogTableVisible")
      .protocal(v-html="getShareData.exportProtocol")
      .bar-check
        el-radio(v-model="agree", :label="1")
          | 同意
        el-radio(v-model="agree", :label="2")
          | 不同意
      .bar-btn
        el-button(type="primary", @click="sure")
          | 确定
        el-button(type="default", @click="cancel")
          | 取消
</template>

<script>
  import filters from '../../../core/filters/index'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'protocalModal',
    components: {
    },
    data () {
      return {
        dialogTableVisible: false,
        agree: ''
      }
    },
    created () {
    },
    destroyed () {
    },
    mounted () {
    },
    computed: {
      ...mapGetters(['getShareData'])
    },
    methods: {
      ...filters,
      ...mapActions([]),
      show () {
        this.dialogTableVisible = true
      },
      close () {
        this.dialogTableVisible = false
      },
      sure () {
        if (this.agree === 1) {
          this.close()
          this.$emit('sure', this)
        } else {
          this.$alert('请选择同意', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
        }
      },
      cancel () {
        this.close()
        this.$emit('cancel', this)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../business/interest/love/common/common";
  #protocalModal {
    .protocal {
      border-top: 1px solid #E6E9ED;
      border-bottom: 1px solid #E6E9ED;
      padding: 20px;
      box-sizing: border-box;
      max-height: 400px;
      overflow-y: auto;
    }
    .bar-check {
      padding: 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #E6E9ED;
    }
    .bar-btn {
      padding: 20px;
      box-sizing: border-box;
      .el-button {
        float: right;
        margin-right: 25px;
        width: 180px;
      }
    }
  }

</style>
