import { request } from '../../../utils/ajax'

// 创建会议
const createMeetingAPI = (data) => request({
  url: `/lqzgh/meeting/create`,
  data
})
// 加载已收到的会议消息
const loadReceivedMeetingAPI = (data) => request({
  url: `/lqzgh/meeting/find/receivedMsg`,
  data
})
// 读取会议消息
const loadReadMeetingsAPI = (data) => request({
  method: 'put',
  url: `/lqzgh/meeting/read`,
  data
})
// 读取创建的会议消息
const loadPublishMeetingAPI = (data) => request({
  url: `/lqzgh/meeting/find/sendMsg`,
  data
})
// 加载本级和下级机构发布的会议
const loadChildenMeetingAPI = (data) => request({
  url: `/lqzgh/meeting/find/sendMsgAll`,
  data
})
// 删除会议
const deletedMeetingAPI = (noticeId) => request({
  method: 'put',
  url: `/lqzgh/meeting/deleted/${noticeId}`
})
// 查看编辑
const loadSendMeetingDetailsAPI = (meetingId) => request({
  method: 'get',
  url: `/lqzgh/meeting/find/sendDetails/${meetingId}`
})
// 获取接收人列表
const loadReceivedMeetingUserAPI = (data) => request({
  url: `/lqzgh/meeting/find/receivedList`,
  data
})
// 导出接收人名单列表
const loadExportMeetingUserAPI = (data) => request({
  url: `/lqzgh/meeting/find/export/receivedList`,
  data
})
export {
  createMeetingAPI,
  loadReceivedMeetingAPI,
  loadReadMeetingsAPI,
  loadPublishMeetingAPI,
  loadChildenMeetingAPI,
  deletedMeetingAPI,
  loadSendMeetingDetailsAPI,
  loadReceivedMeetingUserAPI,
  loadExportMeetingUserAPI
}
