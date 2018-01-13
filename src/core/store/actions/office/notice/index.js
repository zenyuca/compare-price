import * as API from '../../../../api/office/notice/index'
import _ from 'lodash'

export default {
  loadReceivedNotices ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadReceivedNoticesAPI(page)
  },
  loadReadCount ({commit, state}, type) {
    return API.loadReadCountAPI(type)
  },
  loadAllDept ({commit, state}, sendeeId) {
    return API.loadAllDeptAPI({sendeeId})
  },
  loadReadNotices ({commit, state}, notice) {
    return API.loadReadNoticesAPI(notice)
  },
  loadPublishNotices ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadPublishNoticesAPI(page)
  },
  loadChildenNotices ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadChildenNoticesAPI(page)
  },
  findSendeeId ({commit, state}, sendeeId) {
    return API.loadFindSendeeIdAPI({sendeeId})
  },
  loadReceivedListUser ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadReceivedListUserAPI(page)
  },
  loadGetCopySet ({commit, state}, id) {
    return API.loadGetCopySetAPI(id)
  },
  loadExportUserList ({commit, state}, keyParam) {
    return API.loadExportUserListAPI(keyParam)
  },
  createNotice ({commit, state}, notice) {
    return API.createNoticeAPI(notice)
  },
  deletedNotices ({commit, state}, notice) {
    return API.deletedNoticesAPI(notice)
  },
  loadSendDetails ({commit, state}, noticeId) {
    return API.loadSendDetailsAPI(noticeId)
  },
  loadReplyCount ({commit, state}, noticeId) {
    return API.loadReplyCountAPI(noticeId)
  },
  loadFindMsg ({commit, state}, param) {
    return API.loadFindMsgAPI(param.id, param.type)
  },
  loadReplyMsg ({commit, state}, param) {
    return API.loadReplyMsgAPI(param.msg, param.type)
  },
  loadReplyMembers ({commit, state}, noticeId) {
    return API.loadReplyMembersAPI(noticeId)
  },
  loadMemberDetail ({commit, state}, noticeId) {
    return API.loadMemberDetailAPI(noticeId)
  },
  loadLogs ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadLogsAPI(page)
  }
}
