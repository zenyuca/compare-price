/**
 * Created by Windows10 on 2017/11/2.
 */
import { request } from '../../utils/ajax'
const BASE_PATH = '/system'
// 初始化系统
export const initApi = () => request({method: 'put', url: `${BASE_PATH}/init`})
// 清理缓存
export const clearApi = () => request({method: 'put', url: `${BASE_PATH}/clear`})
// 修改系统设置
export const setSysApi = (data) => request({url: `${BASE_PATH}/setting`, data})
// 获取系统设置
export const getSysApi = () => request({method: 'get', url: `${BASE_PATH}/setting`})
// 获取友情链接
export const findLinkApi = (data) => request({url: `${BASE_PATH}/link/find`, data})
// 创建友情链接
export const createLinkApi = (data) => request({url: `${BASE_PATH}/link`, data})
// 修改友情链接
export const updateLinkApi = (data) => request({method: 'put', url: `${BASE_PATH}/link`, data})
// 删除友情链接
export const delLinkApi = (id) => request({method: 'delete', url: `${BASE_PATH}/link/${id}`})
// 获取服务号自定义菜单
export const getFwhMenuApi = () => request({method: 'get', url: `/wechat/fwMenu`})
// 创建服务号自定义菜单
export const createFwhMenuApi = (data) => request({method: 'post', url: `/wechat/fwMenu`, data, options: {headers: {'Content-Type': 'text/plain'}}})
// 删除服务号自定义菜单
export const delFwhMenuApi = () => request({method: 'delete', url: `/wechat/fwMenu`})
// 同步服务号
export const syncfwhApi = () => request({method: 'put', url: `/wechat/syncfwh`})
// 同步企业号
export const syncqyhApi = () => request({method: 'put', url: `/wechat/syncqyh`})
// 获取js 签名
export const jssdkApi = () => request({method: 'get', url: `${BASE_PATH}/jsapi`})
// 通过API获取管理组JS-SDK凭据
export const contactTicketApi = () => request({method: 'get', url: `${BASE_PATH}/contact_ticket`})
// 微信授权登录
export const wxLogin = (data) => request({method: 'post', url: `${BASE_PATH}/oauth2`, data})
// 获取管理员信息
export const getAdmin = () => request({method: 'get', url: `/admin/mine`})
// 获得系动中所有菜单列表(树形结构)
export const getAllMenu = () => request({method: 'get', url: `/menu/getAllMenu`})
export const getLevellyMenu = () => request({method: 'get', url: `/menu/getLevellyMenu`})
export const createMenu = (data) => request({method: 'post', url: `/menu/createMenu`, data})
export const modifyMenu = (data) => request({method: 'put', url: `/menu/modifyMenu`, data})
export const deleteMenu = (data) => request({method: 'put', url: `/menu/deleteMenu`, data})
// 授权菜单
export const authMenu = (data) => request({method: 'put', url: `/admin/authMenu`, data})
// 获得协议配置信息
export const getProtocolApi = (data) => request({method: 'get', url: `/lqzgh/configure/exportProtocol/get/love_Export_protocol_rule`, data})
// 更新协议配置信息
export const updateProtocolApi = (data) => request({method: 'post', url: `/lqzgh/configure/exportProtocol/update/love_Export_protocol_rule`, data})
