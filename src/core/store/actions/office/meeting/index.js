import * as API from '../../../../api/office/meeting/index'
import _ from 'lodash'

export default {
  createMeeting ({commit, state}, meeting) {
    return API.createMeetingAPI(meeting)
  },
  loadReceivedMeeting ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadReceivedMeetingAPI(page)
  },
  loadReadMeetings ({commit, state}, notice) {
    return API.loadReadMeetingsAPI(notice)
  },
  loadPublishMeeting ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadPublishMeetingAPI(page)
  },
  loadChildenMeeting ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadChildenMeetingAPI(page)
  },
  deletedMeeting ({commit, state}, noticeId) {
    return API.deletedMeetingAPI(noticeId)
  },
  loadSendMeetingDetails ({commit, state}, noticeId) {
    return API.loadSendMeetingDetailsAPI(noticeId)
  },
  loadReceivedMeetingUser ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadReceivedMeetingUserAPI(page)
  },
  loadExportMeetingUser ({commit, state}, keyParam) {
    return API.loadExportMeetingUserAPI(keyParam)
  }
}
