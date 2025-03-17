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
function topGifts() {
  return get('/api/v1/topGifts')
}

function check(data: any = null) {
  return post('/api/v1/checkPayment', data)
}
function doLottery(data: any = null) {
  return post('/api/v1/doLottery/1', data)
}

function account() {
  return get('/api/v1/me')
}
function myGifts() {
  return get('/api/v1/myGifts')
}
function allRankList() {
  return get('/api/v1/allRankList')
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
  topGifts,
  myGifts,
  doLottery,
  allRankList,
}
