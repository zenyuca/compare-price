import * as API from '../../../../api/office/request/index'
import _ from 'lodash'

export default {
  getCurrentDeptMembers ({commit, state}) {
    return API.getCurrentDeptMembersAPI()
  },
  createRequest ({commit, state}, request) {
    return API.createRequestAPI(request)
  },
  loadReceivedRequests ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadReceivedRequestsAPI(page)
  },
  loadApproval ({commit, state}, request) {
    return API.loadApprovalAPI(request)
  },
  loadComment ({commit, state}, request) {
    return API.loadCommentAPI(request)
  },
  loadPublishRequests ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadPublishRequestsAPI(page)
  },
  loadRequestById ({commit, state}, requestId) {
    return API.loadRequestByIdAPI(requestId)
  },
  loadRequestById2 ({commit, state}, requestId) {
    return API.loadRequestById2API(requestId)
  },
  deletedRequest ({commit, state}, requestId) {
    return API.deletedRequestAPI(requestId)
  }
}
