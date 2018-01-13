import * as API from '../../../../api/office/check/index'
import _ from 'lodash'

export default {
  loadConfigure ({commit, state}, type) {
    return API.loadConfigureAPI(type)
  },
  addConfigure ({commit, state}, configures) {
    return API.addConfigureAPI(configures)
  },
  createApproval  ({commit, state}, approval) {
    return API.createApprovalAPI(approval)
  },
  loadReceivedApprovals ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadReceivedApprovalsAPI(page)
  },
  loadApproval2 ({commit, state}, request) {
    return API.loadApproval2API(request)
  },
  loadComment2 ({commit, state}, request) {
    return API.loadComment2API(request)
  },
  loadApprovalById ({commit, state}, requestId) {
    return API.loadApprovalByIdAPI(requestId)
  },
  loadPublishApprovals ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadPublishApprovalsAPI(page)
  },
  loadApprovalById2 ({commit, state}, requestId) {
    return API.loadApprovalById2API(requestId)
  },
  deletedApproval ({commit, state}, requestId) {
    return API.deletedApprovalAPI(requestId)
  }
}
