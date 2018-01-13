import Vue from 'vue'
import Base64 from 'js-base64'

// 常量区
const DATA = 'DATA'

class _LocalStorage {
  // 登录的帐号信息
  ACCOUNT = 'account'
  MENUS = 'menus'
  // 共享的通知信息
  NOTICE = 'notice'
  // 当前点中的路由
  CURRENT_ROUTE = 'current_route'
  // 系统设置
  SYSTEM_SETTING = 'system_setting'
  // 二级导航全程
  FULL_NAME = 'full_name'
  hasLocalData () {
    let json = Vue.localStorage.get(DATA)
    if (json) {
      return true
    }
    return false
  }
  getLocalData (key) {
    let json = Vue.localStorage.get(DATA)
    if (json) {
      json = Base64.Base64.decode(json)
      let data = JSON.parse(json)
      if (key) {
        return data[key]
      }
      return data
    } else {
      return {}
    }
  }
  storeLocalData (key, value) {
    let data = this.getLocalData()
    if (key && value) {
      data[key] = value
    }
    this._saveData(data)
  }
  _saveData (data) {
    data = Base64.Base64.encode(JSON.stringify(data))
    Vue.localStorage.set(DATA, data)
  }
  clearLocalData (key) {
    if (key) {
      let data = this.getLocalData()
      delete data[key]
      this._saveData(data)
    } else {
      Vue.localStorage.remove(DATA)
    }
  }
}

let LocalStorage = new _LocalStorage()

export {
  LocalStorage
}
