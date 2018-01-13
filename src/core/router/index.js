import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('@com/login/login.vue')
    }
  ]
})

export default router
