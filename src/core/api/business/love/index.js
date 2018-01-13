import { request } from '../../../utils/ajax'

// 红娘分页查询
const loadMatchmakerAPI = (data) => request({
  url: `/lqzgh/marry/find/matchmaker`,
  data
})
// 红娘详情查询
const loadGetMatchmakerApi = (id) => request({
  url: `/lqzgh/marry/get/matchmaker/${id}`,
  method: 'get'
})
// 红娘审核
const auditMatchmakerApi = (data) => request({
  url: `/lqzgh/marry/audit/matchmaker`,
  method: 'post',
  data
})
// 红娘信息导出
const exportMatchmakerApi = (data) => request({
  url: `/lqzgh/marry/export/matchmaker`,
  method: 'post',
  data
})
// 红娘详情删除
const deleteMatchmakerApi = (id) => request({
  url: `/lqzgh/marry/delete/matchmaker/${id}`,
  method: 'delete'
})
// 机构分页查询
const loadFindHLDepartmentAPI = (data) => request({
  url: `/lqzgh/marry/find/department`,
  method: 'post',
  data
})
// 婚恋机构详情查询
const loadGetHLDepartment = (id) => request({
  url: `/lqzgh/marry/get/department/${id}`,
  method: 'get'
})
// 婚恋机构审核
const exportHLDepartmentApi = (data) => request({
  url: `/lqzgh/marry/export/department`,
  method: 'post',
  data
})
// 婚恋机构审核
const auditHLDepartmentApi = (data) => request({
  url: `/lqzgh/marry/audit/department`,
  method: 'post',
  data
})
// 婚恋机构删除
const deleteHLDepartmentApi = (id) => request({
  url: `/lqzgh/marry/delete/department/${id}`,
  method: 'delete'
})
// 活动分页查询
const loadHLActivityAPI = (data) => request({
  url: `/lqzgh/marry/find/activity`,
  method: 'post',
  data
})
// 红娘详情查询
const loadGetHLActivityApi = (id) => request({
  url: `/lqzgh/marry/get/activity/${id}`,
  method: 'get'
})
// 活动审核
const auditHLActivityApi = (data) => request({
  url: `/lqzgh/marry/audit/activity`,
  method: 'post',
  data
})
// 创建活动
const createHLActivityApi = (data) => request({
  url: `/lqzgh/marry/create/activity`,
  method: 'post',
  data
})
// 创建活动
const loadHLActivityNameListAPI = (data) => request({
  url: `/lqzgh/marry/find/activity/nameList`,
  method: 'post',
  data
})
// 活动参与名单导出
const exportHLActivityNameListApi = (data) => request({
  url: `/lqzgh/marry/export/activityNameList`,
  method: 'post',
  data
})
// 婚恋活动删除
const deleteHLActivityApi = (id) => request({
  url: `/lqzgh/marry/delete/activity/${id}`,
  method: 'delete'
})
// 婚恋活动删除
const updateHLActivityApi = (data) => request({
  url: `/lqzgh/marry/update/activity`,
  data
})
// 婚恋管理系统登录
const marryloginApi = (data) => request({
  url: `/lqzgh/marry/login`,
  data
})
// 婚恋管理系统登录
const loginPasswordApi = (data) => request({
  url: `/lqzgh/marry/login/password`,
  data
})
// 查询红娘业绩
const findMatcAchieveApi = (data) => request({
  url: `/lqzgh/marry/find/matchmaker/achieve`,
  data
})
// 修改婚恋机构密码
const updateHLDeptPwdApi = (data) => request({
  url: `/lqzgh/marry/update/password`,
  data
})
// 修改婚恋机构密码
const hlActivitySendMsgApi = (data) => request({
  url: `/lqzgh/marry/activity/nameList/sendMsg`,
  data
})
export {
  loadMatchmakerAPI,
  loadGetMatchmakerApi,
  auditMatchmakerApi,
  loadFindHLDepartmentAPI,
  loadGetHLDepartment,
  auditHLDepartmentApi,
  loadHLActivityAPI,
  loadGetHLActivityApi,
  auditHLActivityApi,
  deleteMatchmakerApi,
  deleteHLDepartmentApi,
  exportMatchmakerApi,
  exportHLDepartmentApi,
  createHLActivityApi,
  loadHLActivityNameListAPI,
  exportHLActivityNameListApi,
  deleteHLActivityApi,
  updateHLActivityApi,
  marryloginApi,
  findMatcAchieveApi,
  updateHLDeptPwdApi,
  loginPasswordApi,
  hlActivitySendMsgApi
}
