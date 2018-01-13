import { request } from '../../../utils/ajax'

// 查询审批类型
const loadConfigureAPI = (type) => request({
  method: 'get',
  url: `/lqzgh/configure/find/${type}`
})
// 查询审批类型
const addConfigureAPI = (data) => request({
  method: 'post',
  url: `/lqzgh/configure/add`,
  data
})
// 创建工作请示
const createApprovalAPI = (data) => request({
  method: 'post',
  url: `/lqzgh/approval/create`,
  data
})
// 加载我收到工作请示
const loadReceivedApprovalsAPI = (data) => request({
  method: 'post',
  url: `/lqzgh/approval/find/receivedMsg`,
  data
})
// 审批
const loadApproval2API = (data) => request({
  method: 'post',
  url: `/lqzgh/approval/approval`,
  data
})
// 评论
const loadComment2API = (data) => request({
  method: 'post',
  url: `/lqzgh/approval/comment`,
  data
})
// 加载获取单个请求发布详情
const loadApprovalByIdAPI = (requestId) => request({
  method: 'get',
  url: `/lqzgh/approval/get/${requestId}`
})
// 加载我发布的工作请示
const loadPublishApprovalsAPI = (data) => request({
  method: 'post',
  url: `/lqzgh/approval/find/sendMsg`,
  data
})
// 加载获取单个请求发布详情(我发布的)
const loadApprovalById2API = (requestId) => request({
  method: 'get',
  url: `/lqzgh/approval/get2/${requestId}`
})
// 加载获取单个请求发布详情(我发布的)
const deletedApprovalAPI = (requestId) => request({
  method: 'delete',
  url: `/lqzgh/approval/delete/${requestId}/2`
})
export {
  loadConfigureAPI,
  addConfigureAPI,
  createApprovalAPI,
  loadReceivedApprovalsAPI,
  loadApproval2API,
  loadComment2API,
  loadApprovalByIdAPI,
  loadPublishApprovalsAPI,
  loadApprovalById2API,
  deletedApprovalAPI
}
