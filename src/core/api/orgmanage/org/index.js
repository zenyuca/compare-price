import { request } from '../../../utils/ajax'
const BASE_PATH = '/department'
const BASE_PATH2 = '/lqzgh/depart'

// 显示设置
export const updateShow = (data, type) => request({
  method: 'post',
  url: `/lqzgh/admin/update/showSetting/${type}`,
  data
})
// 创建
export const createDepApi = (data) => request({
  url: `${BASE_PATH}/create`,
  data
})
// 修改
export const updateDepApi = (data) => request({
  url: `${BASE_PATH}/update`,
  data
})
// 审批
export const checkingDepApi = (data, type) => request({
  url: `${BASE_PATH2}/received/audit/${type}`,
  data
})
// 修改
export const changeDepApi = (data) => request({
  url: `${BASE_PATH}/change`,
  data
})
// 修改父级F
export const changeParentApi = (data) => request({
  url: `${BASE_PATH}/change`,
  data
})
// 审批通过与否
export const auditDepApi = (data) => request({
  url: `${BASE_PATH}/audit`,
  data
})
// 搜索列表
export const findDepApi = (data, parentid = 0) => request({
  url: `${BASE_PATH}/find/${parentid}`,
  data
})
// 搜索列表
export const exportDepListApi = (data, parentid = 0) => request({
  url: `${BASE_PATH}/exportDep/${parentid}`,
  data
})
// 搜索列表
export const findDepListApi = (data, parentid = 0) => request({
  url: `${BASE_PATH}/findDep/${parentid}`,
  data
})
// 上级工会
export const findUpDepListApi = (data) => request({
  url: `${BASE_PATH2}/find/all`,
  data
})
// 获取详情
export const getDepApi = (id) => request({
  method: 'get',
  url: `${BASE_PATH}/get/${id}`
})
// 获取通讯录
export const getContactApi = (parentId) => request({
  method: 'get',
  url: `${BASE_PATH}/contact/${parentId}`
})
// 删除
export const delDepApi = (id) => request({
  method: 'delete',
  url: `${BASE_PATH}/delete/${id}`
})
// 获取统计列表
export const deptAccountApi = (data) => request({
  url: `${BASE_PATH}/deptAccount`,
  data
})
// 导出统计列表
export const exportDepApi = (data) => request({
  url: `${BASE_PATH}/export`,
  data
})
// 查询下级机构所有
export const getLowerLikeDeptApi = (data) => request({
  url: `${BASE_PATH2}/find/lowerLike`,
  data
})
// 创建干部
export const addAdminApi = (data) => request({
  url: `/admin/create`,
  data
})

