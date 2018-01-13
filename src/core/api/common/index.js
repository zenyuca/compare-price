import { request } from '../../utils/ajax'

// 上日文件
const uploadFileAPI = (data) => request({
  url: `/file/upload`,
  data
})

export {
  uploadFileAPI
}
