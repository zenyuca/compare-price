import * as API from '../../../../api/business/article/index'
import _ from 'lodash'

export default {
  // 获取文章列表 [0,0] 代表公告
  findArticleApi ({commit, state}, [type = -1, del = 0]) {
    let page = _.cloneDeep(state.page)
    // page.keyParam = keyParam
    return API.findArticleApi(page, del, type)
  },
  // 获取文章详情
  getArticle ({commit, state}, id) {
    return API.getArticleApi(id)
  },
  // 创建文章
  createArticle ({commit, state}, data) {
    return API.createArticleApi(data)
  },
  // 修改文章
  updateArticle ({commit, state}, data) {
    return API.updateArticleApi(data)
  },
  // 删除文章
  deleteArticle ({commit, state}, id) {
    return API.delArticleApi(id)
  }
}
