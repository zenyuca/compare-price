import { request } from '../../../utils/ajax'
const BASE_PATH = '/article'

// 创建文章
export const createArticleApi = (data) => request({
  url: `${BASE_PATH}/create`,
  data
})
// 修改
export const updateArticleApi = (data) => request({
  url: `${BASE_PATH}/update`,
  data
})
// 搜索文章列表
export const findArticleApi = (data = {}, del = 0, type = -1) => {
  const sync = window.location.pathname.split('/')[2]
  if (sync === 'qyh' || sync === 'fwh' || sync === 'wzzy') {
    data.filed = [...data.filed || [], 'sync']
    data.keyWord = [...data.keyWord || [], sync === 'qyh' ? '2' : '0']
  }
  return request({
    url: `${BASE_PATH}/find/${del}/${type}`,
    data
  })
}
// 搜索文章列表--福利预告
export const findWelfarePrevApi = (data = {}, del = 0) => {
  const sync = window.location.pathname.split('/')[2]
  if (sync === 'qyh' || sync === 'fwh' || sync === 'wzzy') {
    data.filed = [...data.filed || [], 'sync']
    data.keyWord = [...data.keyWord || [], sync === 'qyh' ? '2' : '0']
  }
  return request({
    url: `${BASE_PATH}/find/${del}`,
    data
  })
}
// 获取文章详情
export const getArticleApi = (id) => request({
  method: 'get',
  url: `${BASE_PATH}/get/${id}`
})
// 删除文章
export const delArticleApi = (id, del = 1) => request({
  method: 'delete',
  url: `${BASE_PATH}/delete/${id}/${del}`
})
// 切换文章状态
export const pauseArticleApi = (id) => request({
  method: 'put',
  url: `${BASE_PATH}/pause/${id}`
})

// 搜索简单文章列表
export const findWzArticleApi = (data = {}, del = 0, type = -1) => {
  const sync = window.location.pathname.split('/')[2]
  if (sync === 'qyh' || sync === 'fwh' || sync === 'wzzy') {
    data.filed = [...data.filed || [], 'sync']
    data.keyWord = [...data.keyWord || [], sync === 'qyh' ? '2' : '0']
  }
  return request({
    url: `${BASE_PATH}/findWz/${del}/${type}`,
    data
  })
}
