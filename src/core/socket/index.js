import {debug} from '../const'
import config from '../config'

let socket, opts, timer
const commands = []
// let baseURL
// if (process.env.NODE_ENV === 'development') {
//   baseURL = "java.ichuangye.cn"
// } else {
//   baseURL = window.location.host
// }
const VueSocket = {
  open: (sessionId) => {
    console.log(sessionId)
    debug('连接websocket...', sessionId)
    if (socket && sessionId) {
      socket.close()
    }
    if (sessionId) {
      opts.sessionId = sessionId
      socket = new WebSocket(`ws://${config.domainname}/websocket/${sessionId}`)
      socket.onopen = (msg) => {
        console.log(msg)
        opts.open && opts.open(msg)
        VueSocket.loop()
      }
      socket.onclose = (msg) => {
        opts.close && opts.close(msg)
        if (opts.reconnect && socket) {
          socket = new WebSocket(msg.target.url)
        }
      }
      socket.onerror = (msg) => {
        opts.error && opts.error(msg)
        if (opts.reconnect && socket) {
          socket = new WebSocket(msg.target.url)
        }
      }
      socket.onmessage = (event) => {
        const {command, data} = JSON.parse(event.data)
        console.log('收到消息',data)
        console.log('command',command)
        debug('收到消息:', command, data)
        if (command === 'loop') {
          VueSocket.loop()
          return
        }
        commands.forEach(({c, fn}) => {
          if (command === c) {
            fn && fn(data)
          }
        })
      }
    }
    return VueSocket
  },
  close: () => {
    if (socket) {
      debug('关闭连接!')
      socket.close()
      socket = null
      timer && clearTimeout(timer)
    }
  },
  on: (c, fn) => {
    commands.length = 0
    commands.push({c, fn})
    return VueSocket
  },
  loop: () => {
    timer = setTimeout(() => {
      console.log('loop:')
      debug('loop...')
      VueSocket.send('loop')
    }, opts.loop)
  },
  send: (command, data) => {
    socket && socket.send(JSON.stringify({command, data}))
    return VueSocket
  }
}

export default {
  install (Vue, o = {
    open: (msg) => debug('WebSocket连接成功：' + msg.target.url),
    close: (msg) => debug('WebSocket连接关闭！'),
    error: (msg) => debug('WebSocket连接异常！'),
    reconnect: true,
    loop: 10000
  })
  {
    opts = o
    Vue.mixin({
      created: function () {
        this.$socket = VueSocket
      }
    })
    Vue.prototype.socket = VueSocket
  }
}

