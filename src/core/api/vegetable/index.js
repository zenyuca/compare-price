import { request } from '../../utils/ajax'

// 管理员导入文件
const adminImportExcelApi = (data) => request({
  method: 'post',
  url: `/export/import/excel`,
  data
})
// 获取招标列表 查询最新招标列表
const findDetailCopyByTypeAPI = (type) => request({
  method: 'get',
  url: `/export/find/bj_export_detail_copy/${type}`
})
// 上传招标文件
const importTenderExcelAPI = (data) => request({
  method: 'post',
  url: `/export/import/tender/excel/${data.type}/${data.exportId}`,
  data
})
// 查询代理商列表
const findAgentListAPI = () => request({
  method: 'get',
  url: `/admin/find/agent`
})
// 新增代理商
const addAgentAPI = (data) => request({
  method: 'post',
  url: `/admin/add/agent`,
  data
})
// 删除代理商
const delAgentAPI = (id) => request({
  method: 'delete',
  url: `/admin/del/agent/${id}`
})
// 修改代理商
const updateAgentAPI = (data) => request({
  method: 'put',
  url: `/admin/update/agent`,
  data
})
// 登陆
const adminLoginAPI = (data) => request({
  method: 'post',
  url: `/admin/login`,
  data
})
// 查询招标结果
const findTenderResultAPI = (type) => request({
  method: 'get',
  url: `/export/find/tender/result/${type}`
})
// 导出招标结果
const exportTenderResultAPI = (type) => request({
  method: 'get',
  url: `/export/export/tender/result/${type}`
})
// 修改图片
const updateImageAPI = (data) => request({
  method: 'post',
  url: `/file/update`,
  data
})
// 查詢图片
const findImageAPI = (data) => request({
  method: 'post',
  url: `/file/find`,
  data
})
// 刪除图片
const delImageAPI = (id) => request({
  method: 'delete',
  url: `/file/delete/${id}/2`
})
// 增加代理商备注
const addRemarkAPI = (data) => request({
  method: 'post',
  url: `/admin/add/remark`,
  data
})
// 查询代理商备注
const findRemarkByIdAPI = (id) => request({
  method: 'get',
  url: `/admin/find/remark/${id}`
})
// 删除代理商备注
const delRemarkAPI = (id) => request({
  method: 'delete',
  url: `/admin/del/remark/${id}`
})
// 添加注意事项
const addConfigurerAPI = (data) => request({
  method: 'post',
  url: `/admin/add/configure`,
  data
})
// 获取注意事项
const getConfigurerAPI = (id) => request({
  method: 'get',
  url: `/admin/get/configure/${id}`
})
export {
  findDetailCopyByTypeAPI,
  adminImportExcelApi,
  importTenderExcelAPI,
  findAgentListAPI,
  addAgentAPI,
  delAgentAPI,
  updateAgentAPI,
  adminLoginAPI,
  findTenderResultAPI,
  exportTenderResultAPI,
  updateImageAPI,
  findImageAPI,
  delImageAPI,
  addRemarkAPI,
  findRemarkByIdAPI,
  delRemarkAPI,
  addConfigurerAPI,
  getConfigurerAPI
}
