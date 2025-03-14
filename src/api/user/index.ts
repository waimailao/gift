import { get, post } from '../client'

function info() {
  return get('/user/info')
}

function login(code: string) {
  return post('/api/v1/login', { code })
}

function gifts() {
  return get('/api/v1/gifts')
}

function check(data: any = null) {
  return post('/api/v1/tgStar/checkPayment?gift_id=1&transaction_id=123321', data)
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
  gifts,
  check,
}
