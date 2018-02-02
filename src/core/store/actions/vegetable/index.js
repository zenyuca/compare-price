import * as API from '../../../api/vegetable/index'
import _ from 'lodash'

export default {
  adminImportExcel ({commit, state}, data) {
    return API.adminImportExcelApi(data)
  },
  findDetailCopyByType ({commit, state}, type) {
    return API.findDetailCopyByTypeAPI(type)
  },
  importTenderExcel ({commit, state}, data) {
    return API.importTenderExcelAPI(data)
  },
  findAgentList ({commit, state}) {
    return API.findAgentListAPI()
  },
  addAgent ({commit, state}, data) {
    return API.addAgentAPI(data)
  },
  delAgent ({commit, state}, id) {
    return API.delAgentAPI(id)
  },
  updateAgent ({commit, state}, data) {
    return API.updateAgentAPI(data)
  },
  adminLogin ({commit, state}, data) {
    return API.adminLoginAPI(data)
  },
  findTenderResult ({commit, state}, type) {
    return API.findTenderResultAPI(type)
  },
  exportTenderResult ({commit, state}, type) {
    return API.exportTenderResultAPI(type)
  },
  updateImage ({commit, state}, file) {
    return API.updateImageAPI(file)
  },
  findImage ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.findImageAPI(page)
  },
  delImage ({commit, state}, id) {
    return API.delImageAPI(id)
  }
}
