import { request } from '../../../utils/ajax'
// 创建干部
export const getAdminApi = (id) => request({
  method: 'get',
  url: `/admin/get/${id}`
})
