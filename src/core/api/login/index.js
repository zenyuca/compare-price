import { request } from '../../utils/ajax'
import md5 from 'md5'

const BASE_PATH = '/admin'
// 获取登录二维码
export const codeApi = () => request({
  method: 'get',
  url: `/lqzgh/marry/login2`
})
// 登出
export const loginOutApi = () => request({
  method: 'put',
  url: `${BASE_PATH}/loginOut`
})
// 获取当前登录
export const adminApi = () => request({
  method: 'get',
  url: `${BASE_PATH}/mine`
})
// 登录
export const loginApi = (data) => request({
  url: `${BASE_PATH}/login`,
  data
})
// 登录
export const changePwdApi = ({oldPwd, pwd}) => request({
  url: `${BASE_PATH}/password`,
  data: {oldPwd: md5(oldPwd), pwd: md5(pwd)}
})
// 获取列表
export const adminListApi = (data) => request({
  url: `${BASE_PATH}/find`,
  data
})
// 获取详情
export const getAdminApi = (id) => request({
  method: 'get',
  url: `${BASE_PATH}/get/${id}`
})
// 创建
export const createAdminApi = (data) => request({
  url: `${BASE_PATH}/create`,
  data: {...data, pwd: data.pwd ? md5(data.pwd) : ''}
})
// 修改
export const updateAdminApi = (data) => request({
  url: `${BASE_PATH}/update`,
  data: {...data, pwd: data.pwd ? md5(data.pwd) : ''}
})
// 删除
export const delAdminApi = (id, del = 2) => request({
  method: 'delete',
  url: `${BASE_PATH}/delete/${id}/${del}`
})
// 审核
export const auditAdminApi = (id, audit = 1) => request({
  method: 'put',
  url: `${BASE_PATH}/audit/${id}/${audit}`
})
// 导出
export const exportAdminApi = (data) => request({
  url: `${BASE_PATH}/export`,
  data
})
