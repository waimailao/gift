import { get, post } from '../client'

function info() {
  return get('/user/info')
}

function login(code: string) {
  return post('/user/login', { code })
}

function account() {
  return get('/account/getAccountInfo')
}

function leave(data: any = null) {
  return post('/user/offline', data)
}

function detail() {
  return get('/user/myDetail')
}

export default {
  info,
  login,
  leave,
  account,
  detail,
}
