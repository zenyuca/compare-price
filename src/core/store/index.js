import Vue from 'vue'
import Vuex from 'vuex'
import noticeActions from './actions/office/notice/index'
import meetingActions from './actions/office/meeting/index'
import activityActions from './actions/office/activity/index'
import requestActions from './actions/office/request/index'
import checkActions from './actions/office/check/index'
import orgActions from './actions/orgmanage/org/index'
import signActions from './actions/orgmanage/sign/index'
import scoreActions from './actions/orgmanage/score/index'
import workerActions from './actions/orgmanage/worker/index'
import cadreActions from './actions/orgmanage/cadre/index'
import commonActions from './actions/common/index'
import systemActions from './actions/system/index'
// business
import articleActions from './actions/business/article/index'
import loveActions from './actions/business/love/index'

import * as types from './mutation-types'
import { page } from '../const/index'
import _ from 'lodash'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录信息
    account: {},
    page: {..._.cloneDeep(page)},
    menus: {
      menus1: [],
      menus2: [],
      menus3: []
    },
    shareData: {
      // 系统导出协议
      exportProtocol: '',
      /**
       * 未读数量
       */
      unReadCount: {
        notice: {
          value: 0
        },
        affiche: {
          value: 0
        },
        activity: {
          value: 0
        },
        meeting: {
          value: 0
        },
        check: {
          value: 0
        },
        request: {
          value: 0
        }
      }
    },
    setting: {}
  },
  getters: {
    getShareData: state => state.shareData,
    getMenus: state => {
      return state.menus
    },
    getPage: state => state.page,
    getAccount: state => state.account,
    setting: state => state.setting
  },
  mutations: {
    [types.SETTING] (state, setting) {
      state.setting = setting ? {...state.setting, ...setting} : {}
    },
    [types.MENUS] (state, menus) {
      state.menus = menus
    },
    [types.PAGE] (state, page) {
      state.page = page
    },
    [types.LOGIN_ACCOUNT] (state, account) {
      state.account = account
    },
    [types.CHANE_SELECT] (state, {key, value, inputSelect}) {
      const i = state.page.filed.indexOf(key)
      if ((!value || value === 'x') && i > -1) {          // 如果选择的全部,就删除当前的字段  也可以加上(说明当前已经有了当前字段) && i > -1
        state.page.filed.splice(i, 1)
        state.page.keyWord.splice(i, 1)
      } else if (value !== 'x' && i > -1) {  // 如果已经选择，就保持不变
        state.page.keyWord[i] = value
      } else if (value !== 'x' && i === -1) {   // 如果在里面不存在，就添加进去
        state.page.filed.push(key)
        state.page.keyWord.push(value)
      }
    }
  },
  actions: {
    ...noticeActions,
    ...meetingActions,
    ...activityActions,
    ...requestActions,
    ...checkActions,
    ...orgActions,
    ...signActions,
    ...scoreActions,
    ...workerActions,
    ...articleActions,
    ...loveActions,
    ...commonActions,
    ...systemActions,
    ...cadreActions,
    storeMenus ({commit}, menus) {
      commit(types.MENUS, menus)
    },
    storePage ({commit}, page) {
      commit(types.PAGE, page)
    },
    resetPage ({commit}) {
      commit(types.PAGE, _.cloneDeep(page))
    },
    storeAccount ({commit}, account) {
      commit(types.LOGIN_ACCOUNT, account)
    },
    storeSetting ({commit}, setting) {
      commit(types.SETTING, setting)
    },
    goBack ({commit}) {
      router.back()
    },
    goUrl ({commit}, [name, id, query, path] = []) {
      router.push({
        name,
        params: typeof id === 'object' ? id : {id},
        query,
        path
      })
    },
    // 更改查询字段
    changeSelect ({commit, state}, data) {
      commit(types.CHANE_SELECT, data)
    }
  }
})
