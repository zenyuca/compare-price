import * as API from '../../../../api/orgmanage/cadre/index'
export default {
  // 获得干部信息
  getAdminById ({commit, state}, id) {
    return API.getAdminApi(id)
  }
}
