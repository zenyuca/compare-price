// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import './core/utils/jsExtend'
import router from './core/router'
import store from './core/store'
import './core/localstorage'
import storeObject from './core/localstorage/storeObject'
// import { LocalStorage } from './core/localstorage/util'
import './core/axios'
import './core/inteceptor/axios'
import routerInteceptor from './core/inteceptor/router'
import ElementUI from 'element-ui'
import '../static/theme/element/index.css'
import { mapGetters, mapActions } from 'vuex'
import Socket from './core/socket/index'
import './components/common/less/common.less'
import { initMenu } from './core/menu/index'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Socket)

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  store,
  storeObject,
  template: '<App/>',
  components: { App },
  created () {
    let user = window.sessionStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      this.storeAccount(user)
      // 加载系统协议配置数据
      this.getProtocol().then((data) => {
        this.getShareData.exportProtocol = data
      })
      initMenu(this.$router, user)
    } else {
      this.$router.replace('/')
    }
  },
  computed: {
    ...mapGetters(['getAccount', 'getShareData'])
  },
  methods: {
    ...mapActions(['storeAccount', 'storeSetting', 'workUnread', 'getProtocol'])
  }
})

routerInteceptor(router, vm)
