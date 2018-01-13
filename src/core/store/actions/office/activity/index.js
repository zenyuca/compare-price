import * as API from '../../../../api/office/activity/index'
import _ from 'lodash'

export default {
  createActivity ({commit, state}, activity) {
    return API.createActivityAPI(activity)
  },
  loadReceivedActivity ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadReceivedActivityAPI(page)
  },
  loadReadMeetings ({commit, state}, notice) {
    return API.loadReadMeetingsAPI(notice)
  },
  loadPublishActivity ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadPublishActivityAPI(page)
  },
  loadChildenActivity ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadChildenActivityAPI(page)
  },
  deletedActivity ({commit, state}, noticeId) {
    return API.deletedActivityAPI(noticeId)
  },
  loadSendActivityDetails ({commit, state}, noticeId) {
    return API.loadSendActivityDetailsAPI(noticeId)
  },
  loadReceivedActivityUser ({commit, state}, keyParam) {
    let page = _.cloneDeep(state.page)
    page.keyParam = keyParam
    return API.loadReceivedActivityUserAPI(page)
  },
  loadExportActivityUser ({commit, state}, keyParam) {
    return API.loadExportActivityUserAPI(keyParam)
  },
  loadReplyActivity ({commit, state}, activityId) {
    return API.loadReplyActivityAPI(activityId)
  },
  loadSignUpActivity ({commit, state}, activityId) {
    return API.loadSignUpActivityAPI(activityId)
  },
  loadCancelSignUpActivity ({commit, state}, activityId) {
    return API.loadCancelSignUpActivityAPI(activityId)
  }
}
