import { request } from '../../../utils/ajax'

// 查询当前工会的所有成员
const getCurrentDeptMembersAPI = () => request({
  method: 'get',
  url: `/lqzgh/admin/find/currentDept/Users`
})
// 创建工作请示
const createRequestAPI = (data) => request({
  method: 'post',
  url: `/work/create`,
  data
})
// 加载我收到工作请示
const loadReceivedRequestsAPI = (data) => request({
  method: 'post',
  url: `/work/find/receivedMsg`,
  data
})
// 审批
const loadApprovalAPI = (data) => request({
  method: 'post',
  url: `/work/approval`,
  data
})
// 评论
const loadCommentAPI = (data) => request({
  method: 'post',
  url: `/work/comment`,
  data
})
// 加载我发布的工作请示
const loadPublishRequestsAPI = (data) => request({
  method: 'post',
  url: `/work/find/sendMsg`,
  data
})
// 加载获取单个请求发布详情
const loadRequestByIdAPI = (requestId) => request({
  method: 'get',
  url: `/work/get/${requestId}`
})
// 加载获取单个请求发布详情(我发布的)
const loadRequestById2API = (requestId) => request({
  method: 'get',
  url: `/work/get2/${requestId}`
})
// 加载获取单个请求发布详情(我发布的)
const deletedRequestAPI = (requestId) => request({
  method: 'delete',
  url: `/work/delete/${requestId}/2`
})
export {
  getCurrentDeptMembersAPI,
  createRequestAPI,
  loadReceivedRequestsAPI,
  loadApprovalAPI,
  loadCommentAPI,
  loadPublishRequestsAPI,
  loadRequestByIdAPI,
  loadRequestById2API,
  deletedRequestAPI
}
