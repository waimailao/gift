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
function doLottery(data: any = null, type: number = 1) {
  return post('/api/v1/doLottery/' + type, data)
}

function account() {
  return get('/api/v1/me')
}
function myGifts() {
  return get('/api/v1/myGifts')
}
function strIntegralList() {
  return get('/api/v1/strIntegralList')
}
function allRankList() {
  return get('/api/v1/allRankList')
}

function leave(data: any = null) {
  return post('/user/offline', data)
}
function giftToGift(data: any = null, id:any = 0) {
  return post('/api/v1/giftToGift/'+id, data)
}
function giftToIntegral(data: any = null,id:any = 0) {
  return post('/api/v1/giftToIntegral/'+id, data)
}
function doBuyIntegral(data: any = null, type_id:number = 1) {
  return post('/api/v1/doBuyIntegral/'+type_id, data)
}

function detail() {
  return get('/user/myDetail')
}
function giftAnimation(id:any = 0) {
  return get('/api/v1/giftAnimation/'+ id)
}

export default {
  giftToIntegral,
  giftAnimation,
  giftToGift,
  doBuyIntegral,
  strIntegralList,
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
