import * as API from '../../../../api/orgmanage/worker/index'
import _ from 'lodash'

export default {
  loadAuditApi ({commit, state}, type) {
    let page = _.cloneDeep(state.page)
    return API.findAuditApi(page, type)
  },
  findMessDep ({commit, state}, type) {
    return API.findMessDepApi(type)
  },
  sendMessDep ({commit, state}, data) {
    return API.sendMessApi(data)
  },
  findMessApi ({commit, state}) {
    let page = _.cloneDeep(state.page)
    return API.findMessApi(page)
  },
  seeMessApi ({commit, state}, id) {
    return API.seeMessApi(id)
  },
  delMessApi ({commit, state}, id) {
    return API.delMessApi(id)
  }
}
