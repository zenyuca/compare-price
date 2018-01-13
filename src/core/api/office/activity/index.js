import { request } from '../../../utils/ajax'

// 创建会议
const createActivityAPI = (data) => request({
  url: `/lqzgh/activity/create`,
  data
})
// 加载已收到的活动消息
const loadReceivedActivityAPI = (data) => request({
  url: `/lqzgh/activity/find/receivedMsg`,
  data
})
// 读取会议消息
const loadReadMeetingsAPI = (data) => request({
  method: 'put',
  url: `/lqzgh/meeting/read`,
  data
})
// 读取创建的活动消息
const loadPublishActivityAPI = (data) => request({
  url: `/lqzgh/activity/find/sendMsg`,
  data
})
// 加载本级和下级机构发布的会议
const loadChildenActivityAPI = (data) => request({
  url: `/lqzgh/activity/find/sendMsgAll`,
  data
})
// 删除活动
const deletedActivityAPI = (noticeId) => request({
  method: 'put',
  url: `/lqzgh/activity/deleted/${noticeId}`
})
// 查看编辑
const loadSendActivityDetailsAPI = (meetingId) => request({
  method: 'get',
  url: `/lqzgh/activity/find/sendDetails/${meetingId}`
})
// 加载通知回复名单列表
const loadReplyActivityAPI = (id) => request({
  method: 'get',
  url: `/lqzgh/activity/find/replyType/${id}`
})

// 获取接收人列表
const loadReceivedActivityUserAPI = (data) => request({
  url: `/lqzgh/activity/find/receivedList`,
  data
})
// 导出接收人名单列表
const loadExportActivityUserAPI = (data) => request({
  url: `/lqzgh/activity/find/export/receivedList`,
  data
})

// 报名
const loadSignUpActivityAPI = (activityId) => request({
  method: 'put',
  url: `/lqzgh/activity/signUp/${activityId}`
})
// 报名
const loadCancelSignUpActivityAPI = (activityId) => request({
  method: 'put',
  url: `/lqzgh/activity/cancelSignUp/${activityId}`
})
export {
  createActivityAPI,
  loadReceivedActivityAPI,
  loadReadMeetingsAPI,
  loadPublishActivityAPI,
  loadChildenActivityAPI,
  deletedActivityAPI,
  loadSendActivityDetailsAPI,
  loadReceivedActivityUserAPI,
  loadExportActivityUserAPI,
  loadReplyActivityAPI,
  loadSignUpActivityAPI,
  loadCancelSignUpActivityAPI
}
