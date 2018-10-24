import {WEB_DOMAIN} from 'common/js/config'
import requery from './requer'

/**
 * 获取账户信息
 * */
export function getUserAccount () {
  const url = `${WEB_DOMAIN}/accounts/info`
  const datas = Object.assign({})

  return requery(url, datas, {method: 'get'})
}

/**
 * 可用银行列表
 * */
export function accountsBanks () {
  const url = `${WEB_DOMAIN}/accounts/banks`
  const datas = Object.assign({})

  return requery(url, datas, {method: 'get'})
}

/**
 * 账户充值
 * @param data
 * {
 *   'charge.custid': 2,
 *   'charge.amount': 0.01,
 *   'charge.chargestyle': JSAPI
 * }
 * */
export function accountsCharge (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/pay/paybill.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/**
 * 取消充值
 * */
export function wxPayCancel (data) {
  const url = `${WEB_DOMAIN}/wx/cancel`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/**
 * 支付结果查询
 * */
export function wePayResult (data) {
  const url = `${WEB_DOMAIN}/wx/result`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}

/**
 * 账户提现
 * @param data
 * {
 *   'draw.custid': 8,
 *   'draw.amount': 500,
 *   'sms.valcode': 145678
 * }
 * */
export function accountsWithdraw (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/customer/withdraw.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/**
 * 账户提现-原油
 * */
export function accountsOilwithdraw (data) {
  const url = `${WEB_DOMAIN}/accounts/oilwithdraw`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/**
 * 银行卡号校验
 * */
export function accountsBankcheck (data) {
  const url = `${WEB_DOMAIN}/accounts/bankcheck`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}

/**
 * 绑定银行卡
 * @param data
 * {
 *   'card.cardno': 12345689,
 *   'card.cardname': '%F8%GE5%G9%F8',
 *   'card.custid': 1,
 *   'sms.valcode': 123456
 * }
 * */
export function accountsBankbind (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/customer/addbankcard.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/**
 * 修改绑定银行卡
 * @param data
 * 参数同上
 * */
export function changeBankCard (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/customer/changecard.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'post'})
}

/**
 * 资金明细
 * @param data
 * {
 *   'cust.id': 2,
 *   'page.page_nums': 10,
 *   'page.page_current': 1
 * }
 * */
export function accountsRecords (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/pay/myrecharges.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}
