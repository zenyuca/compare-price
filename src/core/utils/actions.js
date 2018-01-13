import {Message, MessageBox} from 'element-ui'

const def = { duration: 2000, showClose: true }
export const success = (message = '删除成功！', opts = {}) => new Promise((resolve) => resolve(Message.success({ message, ...def, ...opts })))
export const warning = (message = '删除成功！', opts = {}) => new Promise((resolve) => resolve(Message.warning({ message, ...def, ...opts })))
export const info = (message = '删除成功！', opts = {}) => new Promise((resolve) => resolve(Message.info({ message, ...def, ...opts })))
export const error = (message = '删除成功！', opts = {}) => new Promise((resolve) => resolve(Message.error({ message, ...def, ...opts })))

export const msg = (message = '', type = 'success', title = '提示', opts = {}) => MessageBox(message, title, { type, ...opts })
export const alert = (message = '', type = 'success', title = '提示', opts = {}) => MessageBox.alert(message, title, { type, ...opts })
export const confirm = (message = '', type = 'success', title = '提示', opts = {}) => MessageBox.confirm(message, title, { type, ...opts })
export const prompt = (message = '', type = 'success', title = '提示', opts = {}) => MessageBox.prompt(message, title, { type, ...opts })

