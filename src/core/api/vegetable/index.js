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
  exportTenderResultAPI
}
