import * as API from '../../../../api/orgmanage/score/index'
import _ from 'lodash'

export default {
  loadUserListApi ({commit, state}) {
    let page = _.cloneDeep(state.page)
    return API.findUserApi(page)
  },
  updateScoreApi ({commit, state}, params) {
    let page = _.cloneDeep(state.page)
    return API.updateScoreApi(page, params)
  }
}
