<template lang="pug">
  #login
    .wrapper
      .logo
        | 食堂招投标后台管理系统
      .box-login
        .title
          | 用户登录
        el-form(ref="form-user", :rules="rules", :model="user")
          el-form-item(label="用户名:", prop="name")
            el-input(placeholder="请输入用户名", v-model="user.name")
          el-form-item(label="密码:", prop="pwd")
            el-input(placeholder="请输入密码", type="password", v-model="user.pwd")
          <!--el-form-item()-->
            <!--el-checkbox-->
              <!--| 记住密码-->
            <!--a-->
              <!--| 忘记密码-->
          el-form-item()
            el-button(type="primary", @click="login")
              | 登录
</template>

<script>
  import { initMenu } from '../../core/menu/index'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data: function () {
      return {
        user: {
          name: '',
          pwd: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapGetters(['getAccount', 'getShareData'])
    },
    created () {
    },
    mounted () {
      let pe = document.getElementById('login')
      let e = document.querySelector('.wrapper')
      let h = e.clientHeight
      pe.style['padding-top'] = `${(pe.clientHeight - h) / 2}px`
    },
    methods: {
      ...mapActions(['storeAccount', 'getSysApi', 'storeSetting', 'marrylogin', 'loginPassword', 'getProtocol']),
      login () {
        this.$refs['form-user'].validate((valid) => {
          if (valid) {
            if (this.user.name === '13458500321') {
              this.user.role = 1
            } else {
              this.user.role = 0
            }
            this.storeAccount(this.user)
            window.sessionStorage.setItem('user', JSON.stringify(this.user))
            initMenu(this.$router, this.getAccount)
            this.$router.replace('/index')

            // const {phone, pwd} = this.user
            // this.loginPassword({phone, pwd: md5(pwd)}).then((data) => {
            //   console.log(data)
            //   this.storeAccount(data)

            //   // 加载系统协议配置数据
            //   this.getProtocol().then((data) => {
            //     this.getShareData.exportProtocol = data
            //   })
            // }).catch((data) => {
            //   this.$alert(data.msg || '服务器异常', '提示', {
            //     confirmButtonText: '确定',
            //     callback: action => {}
            //   })
            // })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @width: 866px;
  @height: 658px;

  #login {
    background-color: #00b1c6;
    background-image: url("./icon/bg.jpeg");
    background-repeat: no-repeat;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    .wrapper {
      margin: 0px auto;
      text-align: center;
      .logo {
        font-size: 26px;
        letter-spacing: 4px;
        margin-bottom: 20px;
        color: white;
      }
      .box-login {
        margin: 0px auto;
        background-color: white;
        border: 1px solid;
        border-radius: 4px;
        width: 300px;
        padding: 20px;
        padding-bottom: 0px;
        a {
          margin-left: 100px;
          text-decoration: underline;
          cursor: pointer;
        }
        .title {
          font-size: 18px;
        }
        .el-button {
          width: 100%;
        }
      }
    }
  }

  ::-webkit-input-placeholder {
    color: #6d7a84 !important;
    font-size: 12px;
  }
</style>
