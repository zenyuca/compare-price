import { request } from '../../../utils/ajax'

// 查看办公中所有未读的数量
const workUnreadAPI = () => request({
  url: `/lqzgh/common/find/workUnread`
})

export {
  workUnreadAPI
}
