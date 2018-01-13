import * as API from '../../../../api/orgmanage/org/index'
import _ from 'lodash'

export default {
  // 获取工会列表
  loadDepListApi ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    // page.keyParam = keyParam
    return API.findDepListApi(page)
  },
  // 获取工会详情
  getDepApi ({commit, state}, id) {
    // const {params: {id}} = state.route
    return API.getDepApi(id)
  },
  // 删除工会
  delDepApi ({commit, state}, id) {
    return API.delDepApi(id)
  },
  // 创建工会
  createOrg ({commit, state}, data) {
    return API.createDepApi(data)
  },
  // 修改工会
  updateOrg ({commit, state}, data) {
    return API.updateDepApi(data)
  },
  // 工会审批列表
  checkingOrg ({commit, state}, type) {
    let page = _.cloneDeep(state.page)
    return API.checkingDepApi(page, type)
  },
  // 审批通过与否
  auditDep ({commit, state}, data) {
    return API.auditDepApi(data)
  },
  getLowerLikeDept ({commit, state}, data) {
    return API.getLowerLikeDeptApi(data)
  },
  // 创建干部
  addAdmin ({commit, state}, data) {
    return API.addAdminApi(data)
  }
}
