import {WEB_DOMAIN, WX_API, APP_ID, SNS_SCOPE} from 'common/js/config'
import requery from './requer'

/**
 * 微信Auth2鉴权
 * @description https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
 * */
export function getWeChatCode () {
  const pageUrl = window.location.href.split('#')[0]
  /* eslint-disable no-undef */
  const redirectUri = encodeURIComponent(pageUrl + '#/author')
  const scope = SNS_SCOPE
  const wxApi = WX_API
  // 判断为哪个项目
  const appId = APP_ID
  // 获取当前日期 年月日
  const state = parseInt(new Date().toLocaleDateString().replace(/\//g, ''))
  // location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd98ac7a086d8025e&redirect_uri=' + encodeURIComponent(redirectUri) + '&response_type=code&scope=snsapi_base&state=124536463#wechat_redirect'

  location.href = `${wxApi}/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
}

/**
 * 登录
 * @param data
 * {
 *   'cust.phone': '13025145748',
 *   'cust.password': '123456'
 * }
 * */
export function login (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/customer/login.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/* 退出登录 */
export function logout (data) {
  const url = `${WEB_DOMAIN}/users/logout`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/**
 * 微信登录
 * @param data
 * {
 *   'cust.openid': 'ojZbs1BSqBixLM2tDAnyz5ipooc'
 * }
 * */
export function weChatLogin (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/customer/wxlogin.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}

/**
 * 解绑微信号
 * @param data
 * {
 *   'cust.id': 1
 * }
 * */
export function weChatReleaseBind (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/customer/releasebind.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}

/**
 * 换取openId
 * @param data
 * {
 *   code: '011FOKGEKCMGEVNCESL4EF15'
 * }
 * */
export function getWeChatOpenId (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/weixin/getopenid.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}

/**
 * 获取用户session数据
 * @param data
 * {
 *   'cust.id': 3
 * }
 * */
export function getUserSession (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/customer/CustInfo.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}

/* 手机号查重复 TODO--已变更 */
export function usersMobileavailable (data) {
  const url = `${WEB_DOMAIN}/users/mobileavailable`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/**
 * 注册
 * @param data
 * {
 *   'cust.name': '姓名',
 *   'cust.phone': '13025145748',
 *   'cust.password': '123456',
 *   'cust.invitor': 8100,
 *   'sms.valcode': 125415
 * }
 * */
export function register (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/customer/Register.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/**
 * 找回密码
 * @param data
 * {
 *   'cust.id': '',
 *   'cust.password': '123456',
 *   'sms.valcode': 125415
 * }
 * */
export function passwordLost (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/customer/updatewithsms.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/**
 * 修改密码
 * @param data
 * {
 *   'cust.id': 1,
 *   'cust.phone': 130********,
 *   'cust.password': 123,
 *   'sms.valcode'
 * }
 */
export function forgetPassword (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/customer/updatewithsms.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/**
 * 验证码
 * @param data
 * {
 *   'sms.phone': '13025145748'
 * }
 * */
export function verifyCode (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/customer/sendvalcode.do`

  return requery(url, data, {method: 'get'})
}

/* Jssdk配置信息 */
export function wxJssdk (data) {
  const url = `${WEB_DOMAIN}/wx/jssdk`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}
