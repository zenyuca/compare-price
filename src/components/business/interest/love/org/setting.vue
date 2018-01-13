<template lang="pug">
  #org-detail.wrapper-content
    c-header(:menuNames="menuNames")
      .goback(slot='right')
        img(src='/static/icon/goback.png', alt='返回', @click='goBack')
    .wrapper-list-content
      .wrapper-list-middle
        .public-form-box
          .public-form-content
            el-form.public-form(:model="password",:rules="rules",ref="password")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="登录账号：")
                    el-input(v-model="this.getAccount.user.phone", disabled="disabled")
                el-col(:span="12")
                  el-form-item(label="原密码:", prop="oldPwd")
                    el-input(v-model="password.oldPwd",type="password",auto-complete="off")
              el-row(:gutter="60")
                el-col(:span="12")
                  el-form-item(label="新密码：", prop="pwd")
                    el-input(v-model="password.pwd",type="password",auto-complete="off")
                el-col(:span="12")
                  el-form-item(label="确认密码:", prop="repeat")
                    el-input(v-model="password.repeat",type="password",auto-complete="off")
          .posb
            el-button.submit(type="primary", @click="submitForm('password')")
              | 提交
</template>

<script>
  import CHeader from '../../../../common/header/cHeader.vue'
  import filters from '../../../../../core/filters'
  import { mapGetters, mapActions } from 'vuex'
  import { success, error } from '../../../../../core/utils/actions'
  import md5 from 'md5'

  export default {
    components: {
      CHeader
    },
    data () {
      var validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'))
        } else {
          if (this.password.repeat !== '') {
            this.$refs.password.validateField('repeat')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.password.pwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        menuNames: [
          {
            name: '密码设置',
            route: '',
            on: true
          }
        ],
        password: {},
        rules: {
          oldPwd: [{required: true, message: '请输入原密码', trigger: 'blur'}],
          pwd: [{validator: validatePass, trigger: 'blur'}],
          repeat: [{validator: validatePass2, trigger: 'blur'}]
        }
      }
    },
    created () {
    },
    destroyed () {
    },
    mounted () {
    },
    computed: {
      ...mapGetters(['getPage', 'getAccount'])
    },
    methods: {
      ...filters,
      ...mapActions(['resetPage', 'goBack', 'updateHLDeptPwd']),
      loadData () {
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateHLDeptPwd({oldPwd: md5(this.password.oldPwd), pwd: md5(this.password.pwd)}).then((data) => {
              success('设置成功')
              this.dialogFormVisible = false
            }).catch((data) => {
              error(data.msg)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .posb {
    box-sizing: border-box;
    padding-right: 20px;
    text-align: right;
    .el-button {
      width: 180px;
    }
  }
</style>
