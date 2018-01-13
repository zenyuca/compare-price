/**
 * 自定义浏览器事件处理工具
 * author: cy
 * date: 2017年9月22日
 */

// 浏览器类型
const Opera = 'Opera'
const Firefox = 'Firefox'
const Chrome = 'Chrome'
const Safari = 'Safari'
const IE = 'IE'

// 当前滚动元素
let currentScollElement = null

// 浏览器鼠标滑轮事件名称
const whellEventNameMap = new Map([
  [Firefox, 'DOMMouseScroll'],
  [Chrome, 'mousewheel'],
  [IE, 'onmousewheel']
])

function getBrowserName () {
  // 取得浏览器的userAgent字符串
  let userAgent = navigator.userAgent
  let isOpera = userAgent.indexOf(Opera) > -1
  if (isOpera) {
    return Opera
  }
  if (userAgent.indexOf(Firefox) > -1) {
    return Firefox
  }
  if (userAgent.indexOf(Chrome) > -1) {
    return Chrome
  }
  if (userAgent.indexOf(Safari) > -1) {
    return Safari
  }
  if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
    return IE
  }
}

function _hanlder (e) {
  let element = currentScollElement
  let stepLen = element.stepLen
  e.stopPropagation()
  e = e || window.event
  var delD = e.wheelDelta ? e.wheelDelta : -e.detail * 40
  var moves = delD > 0 ? -stepLen : stepLen
  element.scrollLeft += moves
  if (_wheelEnd(element) && element.callback && !element.loading) {
    element.callback(element)
  }
}

function addWhellEvent (element, callback, stepLen = 50) {
  let whellEventName = getWhellEventName()
  if (whellEventName && whellEventName !== IE) {
    element.stepLen = stepLen
    element.callback = callback
    currentScollElement = element
    element.addEventListener(whellEventName, _hanlder, false)
  }
}

function removeWhellEvent (element) {
  let whellEventName = getWhellEventName()
  if (whellEventName && whellEventName !== IE) {
    element.removeEventListener(whellEventName, _hanlder, false)
  }
}

function getWhellEventName () {
  let browserName = getBrowserName()
  let whellEventName = whellEventNameMap.get(browserName)
  return whellEventName
}

/**
 * 注意：只针对使用 element-ui 的 table 有效
 *      其它情况不要用
 * @author: caoyu
 * @date: 2017-09-28
 */
function bindTableWhellEvent (callback) {
  let element = document.querySelector('.el-table__body')
  if (element) {
    let whellEventName = getWhellEventName()
    element.addEventListener(whellEventName, (e) => {
      let element = document.querySelector('.el-table__body-wrapper')
      let stepLen = 50
      e.stopPropagation()
      e = e || window.event
      var delD = e.wheelDelta ? e.wheelDelta : -e.detail * 40
      var moves = delD > 0 ? -stepLen : stepLen
      element.scrollLeft += moves
      if (_wheelEnd(element) && callback && !element.loading) {
        callback(element)
      }
    }, false)
  }
}

function _wheelEnd (e) {
  return (e.scrollLeft + e.offsetWidth) >= e.scrollWidth
}

/**
 * 注意：只针对使用 element-ui 的 table 有效
 *      并且重置了滚动条高度时
 *      其它情况不要用
 * @author: caoyu
 * @date: 2017-09-28
 */
function fixedHeight () {
  setTimeout(() => {
    _cutLeftHeight(document.querySelector('.el-table__fixed'))
    _cutLeftHeight(document.querySelector('.el-table__fixed-right'))
  }, 10)
}

function _cutLeftHeight (element) {
  if (element) {
    element.style.height = `${parseInt(element.style.height) + 4}px`
  }
}

export {
  addWhellEvent,
  removeWhellEvent,
  getWhellEventName,
  bindTableWhellEvent,
  fixedHeight
}
