import { request } from '../../../utils/ajax'
const BASE_PATH = '/user'

// 条件查询列表
export const findUserApi = (data) => request({
  url: `${BASE_PATH}/find`,
  data
})
// 增加减少积分
export const updateScoreApi = (data, {scoreType, id, score}) => request({
  method: 'put',
  url: `/lqzgh/history/score/update/${scoreType}/${id}/${score}`,
  data
})
