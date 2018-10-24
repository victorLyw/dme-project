import {WEB_DOMAIN} from 'common/js/config'
import requery from './requer'

/**
 * 订单(仓位)查询
 * @param data
 * {
 *  'customer.id': 1,
 *  'page.page_nums': 20,
 *  'page.page_current': 1
 * }
 * */
export function getPositionsOrder (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/trans/getAllorder.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}

/**
 * 获取客户未完成订单
 * @param data
 * {
 *   'customer.id': 1,
 *   'page.page_nums': 20,
 *   'page.page_current': 1
 * }
 * */
export function getUnFinishOrder (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/trans/getunFinish.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}

/**
 * 客户已完成订单
 * @param data
 * {
 *   'customer.id': 1,
 *   'page.page_nums': 20,
 *   'page.page_current': 1
 * }
 * */
export function getFinishOrder (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/trans/getFinish.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}

/**
 * 指定订单详情
 * @param data
 * {
 *   'order.id': 6
 * }
 * */
export function getOrderListDetails (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/trans/getOrder.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}
