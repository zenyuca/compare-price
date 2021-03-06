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
  findTenderResult ({commit, state}, data) {
    return API.findTenderResultAPI(data)
  },
  exportTenderResult ({commit, state}, data) {
    return API.exportTenderResultAPI(data)
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
  },
  addRemark ({commit, state}, data) {
    return API.addRemarkAPI(data)
  },
  findRemarkById ({commit, state}, id) {
    return API.findRemarkByIdAPI(id)
  },
  delRemarker ({commit, state}, id) {
    return API.delRemarkAPI(id)
  },
  addConfigurer ({commit, state}, data) {
    return API.addConfigurerAPI(data)
  },
  getConfigurer ({commit, state}, id) {
    return API.getConfigurerAPI(id)
  }
}
