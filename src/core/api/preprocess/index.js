import { request } from '../../utils/ajax'
// 查询办公类所有待处理数据
export const preprocessOfficeApi = (data) => request({
  method: 'get',
  url: `/lqzgh/common/find/pendingWork`,
  data
})
// 根据类型查询出办公中未读数据
// 通知(0), 公告(1), 活动(2), 会议(3), 请示(4), 审批(5);
export const preprocessOfficeForTypeApi = (type) => request({
  method: 'get',
  url: `/lqzgh/common/find/${type}/pendingWork`
})
