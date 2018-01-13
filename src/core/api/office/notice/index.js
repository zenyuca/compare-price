import { request } from '../../../utils/ajax'

// 加载已收到的通知
const loadReceivedNoticesAPI = (data) => request({
  url: `/lqzgh/notice/find/${data.keyParam.type}/receivedMsg`,
  data
})
// 加载已收到的通知
const loadReadCountAPI = (type = 0) => request({
  method: 'get',
  url: `/lqzgh/notice/get/${type}/unreadCount`
})
// 加载发布的通知
const loadPublishNoticesAPI = (data) => request({
  url: `/lqzgh/notice/find/${data.keyParam.type}/sendMsg`,
  data
})
// 加载本级和下级机构发布的通知
const loadChildenNoticesAPI = (data) => request({
  url: `/lqzgh/notice/find/${data.keyParam.type}/sendMsgAll`,
  data
})
// 回复消息
const loadReadNoticesAPI = (data) => request({
  method: 'put',
  url: `/lqzgh/notice/read`,
  data
})
// 加载所有部门信息
const loadAllDeptAPI = (data) => request({
  url: `/lqzgh/depart/findDeptAndAdmin`,
  data
})
// 筛选部门人员
const loadFindSendeeIdAPI = (data) => request({
  url: `/lqzgh/depart/findSendeeId`,
  data
})
// 获取接收人列表
const loadReceivedListUserAPI = (data) => request({
  url: `/lqzgh/notice/find/receivedList`,
  data
})
// 获取回复类型
const loadGetCopySetAPI = (data) => request({
  url: `/lqzgh/notice/find/getCopySet/${data}`
})
// 导出接收人名单列表
const loadExportUserListAPI = (data) => request({
  url: `/lqzgh/notice/find/export/receivedList`,
  data
})
// 新建通知
const createNoticeAPI = (data) => request({
  url: `/lqzgh/notice/create/${data.type}`,
  data
})
// 删除通知 公告
const deletedNoticesAPI = (notice) => request({
  method: 'put',
  url: `/lqzgh/notice/deleted/${notice.noticeId}/${notice.type}`
})
// 查看编辑
const loadSendDetailsAPI = (noticeId) => request({
  method: 'get',
  url: `/lqzgh/notice/find/sendDetails/${noticeId}`
})
// 加载回复数量
const loadReplyCountAPI = (noticeId) => request({
  method: 'get',
  url: `/lqzgh/notice/find/getReadCount/${noticeId}`
})

const loadFindMsgAPI = (noticeId, type) => request({
  method: 'get',
  url: `/lqzgh/notice/find/msg/${noticeId}/${type}`
})

const loadReplyMsgAPI = (data, type) => request({
  method: 'post',
  url: `/lqzgh/notice/create/msg/${type}`,
  data
})

// 加载通知回复名单列表
const loadReplyMembersAPI = (id) => request({
  method: 'get',
  url: `/lqzgh/notice/find/replyType/${id}`
})

const loadMemberDetailAPI = (id) => request({
  method: 'get',
  url: `/lqzgh/admin/find/details/${id}`
})
// 日志查询
const loadLogsAPI = (data) => request({
  method: 'post',
  url: `/lqzgh/log/find/${data.keyParam.type}`,
  data
})
export {
  loadReceivedNoticesAPI,
  loadReadNoticesAPI,
  loadPublishNoticesAPI,
  loadAllDeptAPI,
  loadChildenNoticesAPI,
  loadFindSendeeIdAPI,
  loadReceivedListUserAPI,
  loadGetCopySetAPI,
  loadExportUserListAPI,
  createNoticeAPI,
  deletedNoticesAPI,
  loadSendDetailsAPI,
  loadReadCountAPI,
  loadReplyCountAPI,
  loadFindMsgAPI,
  loadReplyMsgAPI,
  loadReplyMembersAPI,
  loadMemberDetailAPI,
  loadLogsAPI
}
