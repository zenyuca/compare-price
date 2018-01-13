/**
 * Created by Windows10 on 2017/11/2.
 */
import * as API from '../../../api/system/systemApi'
import { workUnreadAPI } from '../../../api/office/common'
export default {
  // 获取文章列表 [0,0] 代表公告
  getSysApi ({commit, state}) {
    return API.getSysApi()
  },
  // 保存系统设置
  setSysApi ({commit, state}, setting) {
    return API.setSysApi(setting)
  },
  // 获得协议配置信息
  getProtocol ({commit, state}, data) {
    return API.getProtocolApi(data)
  },
  // 获得协议配置信息
  updateProtocol ({commit, state}, data) {
    return API.updateProtocolApi(data)
  },
  // 获取管理员信息
  getAdmin ({commit, state}) {
    return API.getAdmin()
  },
  // 查看办公中所有未读的数量
  workUnread ({commit, state}) {
    return Promise.resolve(workUnreadAPI().then((data) => {
      state.shareData.unReadCount.notice.value = data.notice || 0
      state.shareData.unReadCount.affiche.value = data.affiche || 0
      state.shareData.unReadCount.activity.value = data.activity || 0
      state.shareData.unReadCount.meeting.value = data.meeting || 0
      state.shareData.unReadCount.request.value = data.request || 0
      state.shareData.unReadCount.check.value = data.approval || 0
    }))
  }
}
