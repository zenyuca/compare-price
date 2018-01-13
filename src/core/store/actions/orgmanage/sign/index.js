import * as API from '../../../../api/orgmanage/sign/index'
import _ from 'lodash'

export default {
  loadSignListApi ({commit, state}, id) {
    let page = _.cloneDeep(state.page)
    return API.getSignApi(id, page)
  },
  loadMineScoreApi ({commit, state}, id) {
    let page = _.cloneDeep(state.page)
    return API.mineScoreApi(id, page)
  },
  loadUserApi ({commit, state}, id) {
    return API.getByIdApi(id)
  },
  updateUserApi ({commit, state}, data) {
    return API.updateUserApi(data)
  },
  delUserApi ({commit, state}, params) {
    return API.delUserApi(params.id, params.del)
  }
}
