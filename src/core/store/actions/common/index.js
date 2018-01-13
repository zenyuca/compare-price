import * as API from '../../../api/common/index'

export default {
  uploadFile ({commit, state}, formdata) {
    return API.uploadFileAPI(formdata)
  }
}
