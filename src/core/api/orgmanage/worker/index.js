import { request } from '../../../utils/ajax'
const BASE_PATH = '/lqzgh/user'

// 条件审批查询列表
export const findAuditApi = (data, type = 1) => request({
  url: `${BASE_PATH}/received/audit/${type}`,
  data
})

// 消息群发 选择工会
export const findMessDepApi = (type = 1) => request({
  url: `/lqzgh/depart/find/lower/${type}`
})

// 消息群发 lqzgh/admin/send/msg
export const sendMessApi = (data) => request({
  url: `/lqzgh/admin/send/msg`,
  data
})
// 消息群发 列表
export const findMessApi = (data) => request({
  url: `/lqzgh/admin/find/msg`,
  data
})
// 消息群发 查看详情
export const seeMessApi = (id) => request({
  method: 'get',
  url: `/lqzgh/admin/get/${id}`
})
// 消息群发 删除
export const delMessApi = (id) => request({
  method: 'delete',
  url: `/lqzgh/admin/delete/${id}`
})
