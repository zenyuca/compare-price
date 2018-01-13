import * as API from '../../../../api/business/love/index'
import _ from 'lodash'

export default {
  // 红娘分页
  loadMatchmaker ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadMatchmakerAPI(page)
  },
  // 红娘详情
  loadGetMatchmaker ({commit, state}, id) {
    return API.loadGetMatchmakerApi(id)
  },
  // 红娘审核
  auditMatchmaker ({commit, state}, data) {
    return API.auditMatchmakerApi(data)
  },
  // 红娘删除
  deleteMatchmaker ({commit, state}, id) {
    return API.deleteMatchmakerApi(id)
  },
  // 导出红娘信息
  exportMatchmaker ({commit, state}, data) {
    return API.exportMatchmakerApi(data)
  },
  // 婚恋机构分页
  loadFindHLDepartment ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadFindHLDepartmentAPI(page)
  },
  // 机构详情
  loadGetHLDepartment ({commit, state}, id) {
    return API.loadGetHLDepartment(id)
  },
  // 导出机构信息
  exportHLDepartment ({commit, state}, data) {
    return API.exportHLDepartmentApi(data)
  },
  // 婚恋机构审核审核
  auditHLDepartment ({commit, state}, data) {
    return API.auditHLDepartmentApi(data)
  },
  // 婚恋机构删除
  deleteHLDepartment ({commit, state}, id) {
    return API.deleteHLDepartmentApi(id)
  },
  // 活动分页查询
  loadHLActivity ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadHLActivityAPI(page)
  },
  // 活动详情
  loadGetHLActivity ({commit, state}, id) {
    return API.loadGetHLActivityApi(id)
  },
  // 活动审核
  auditHLActivity ({commit, state}, data) {
    return API.auditHLActivityApi(data)
  },
  // 创建活动
  createHLActivity ({commit, state}, data) {
    return API.createHLActivityApi(data)
  },
  // 活动参与名单查询
  loadHLActivityNameList ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadHLActivityNameListAPI(page)
  },
  // 导出活动参与名单
  exportHLActivityNameList ({commit, state}, data) {
    return API.exportHLActivityNameListApi(data)
  },
  // 活动删除
  deleteHLActivity ({commit, state}, id) {
    return API.deleteHLActivityApi(id)
  },
  // 修改活动
  updateHLActivity ({commit, state}, id) {
    return API.updateHLActivityApi(id)
  },
  // 婚恋管理系统登录
  marrylogin ({commit, state}, id) {
    return API.marryloginApi(id)
  },
  // 婚恋系统密码登陆
  loginPassword ({commit, state}, data) {
    return API.loginPasswordApi(data)
  },
  // 查询红娘业绩
  findMatcAchieve ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.findMatcAchieveApi(page)
  },
  // 修改婚恋机构密码
  updateHLDeptPwd ({commit, state}, data) {
    return API.updateHLDeptPwdApi(data)
  },
  // 婚恋活动群发消息
  hlActivitySendMsg ({commit, state}, data) {
    return API.hlActivitySendMsgApi(data)
  }
}
