// 格式化日期，返回今天、昨天、日期
export const dateTodayFilter = (timestamp) => {
  let date = new Date(timestamp)
  let today = new Date()
  let pattern = 'yyyy-MM-dd'
  if (date.Format(pattern) === today.Format(pattern)) {
    return `今天 ${date.Format('hh:mm')}`
  }
  today.setDate(today.getDate() - 1)
  if (date.Format(pattern) === today.Format(pattern)) {
    return `昨天 ${date.Format('hh:mm')}`
  }
  return date.Format('MM-dd hh:mm')
}

export const readtypeFilter = (readtype) => readtype === 0 ? '未处理' : '已处理'
export const noticeTypeFilter = (type) => ['通知', '公告'][type] || '通知'
export const activityTypeFilter = (type) => ['未开始', '报名中', '暂停', '进行中', '已结束'][type] || '未开始'

export const positionTypeFilter = (positionType) => ['', '主席', '副主席', '委员'][positionType] || '委员'
export const agreeTypeFilter = (positionType) => ['', '审核中', '已同意', '已拒绝'][positionType] || ''
export const actionTypeFilter = (positionType) => ['增加', '删除'][positionType] || ''
export const entryTypeFilter = (positionType) => [false, true][positionType] || false
export const matchmakerTypeFilter = (positionType) => ['个人红娘', '机构红娘'][positionType] || ''
export const singleTypeFilter = (positionType) => ['', '单身', '离异'][positionType] || ''
export const entryTypeStrFilter = (positionType) => ['所有用户可报名', '认证用户可报名'][positionType] || ''

export const calcFileSizeFileter = (bytes) => {
  let a = bytes / 1024
  if (a < 1024) {
    return `${a.toFixed(2)}KB`
  } else {
    a /= 1024
    return `${a.toFixed(2)}MB`
  }
}
// 性别过滤器   0->未知,1->男,2->女
export const sexFilter = (sex) => ['未知', '男', '女'][sex] || '未知'
// 认证信息过滤
export const politicalFilter = ({political}) => ['中共党员', '共青团员', '无党派人士', '群众', '民革', '民盟', '民建', '民进', '农工党', '致公党', '台盟', '九三学社'][political] || '群众'
export const cultureFilter = ({culture}) => ['小学及以下', '初中', '高中、技校', '中专', '大专', '大学本科', '硕士研究生', '博士研究生'][culture] || '大学本科'
export const skillsFilter = ({skill}) => ['初级工', '中级工', '高级工', '技师', '高级技师', '初级职称', '中级职称', '高级职称', '无'][skill] || '无'
export const levelsFilter = ({level}) => ['全国', '省部级', '市级'][level] || '市级'
export const employmentsFilter = ({employment}) => ['在岗', '待岗', '失业', '病休', '退休', '退职', '退养（即内退）'][employment] || '在岗'
export const mutualFilter = ({mutual}) => mutual ? '是' : '否'
export const modelFilter = ({model}) => model ? '是' : '否'
export const difficultyFilter = ({difficulty}) => difficulty ? '是' : '否'
export const countrysideFilter = ({countryside}) => countryside ? '是' : '否'
// 下载次数
export const filesNumFilter = (files = []) => files.reduce((p, {num = 0}) => p + num, 0)
export const filesFilter = (files = []) => files.map(({name}) => name).join('，')
// 新闻类型
export const typeFilter = (type, idx) => type ? type[idx] : '无'
export const type2Filter = (type, idx) => type && type[idx] && type[idx].name ? type[idx].name : '无'

export default {
  dateTodayFilter,
  readtypeFilter,
  noticeTypeFilter,
  positionTypeFilter,
  calcFileSizeFileter,
  sexFilter,
  filesNumFilter,
  filesFilter,
  typeFilter,
  activityTypeFilter,
  type2Filter,
  agreeTypeFilter,
  actionTypeFilter,
  politicalFilter,
  cultureFilter,
  skillsFilter,
  levelsFilter,
  employmentsFilter,
  mutualFilter,
  modelFilter,
  difficultyFilter,
  countrysideFilter,
  entryTypeFilter,
  matchmakerTypeFilter,
  singleTypeFilter,
  entryTypeStrFilter
}
