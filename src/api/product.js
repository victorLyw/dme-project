import {WEB_DOMAIN} from 'common/js/config'
import requery from './requer'

/**
 * 获取产品分类列表
 * */
export function getGoodsCategory () {
  const url = `${WEB_DOMAIN}/optiontrans/API/product/getcategory.do`
  const datas = Object.assign({})

  return requery(url, datas, {method: 'get'})
}

/**
 * 获取分类产品列表
 * @param data
 * {
 *   'base.basetype': 2,
 *   'page.page_nums': 5,
 *   'page.page_current': 1
 * }
 * */
export function getCategoryList (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/product/getcategoryproducts.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}

/**
 * 获取商品详情
 * @param data
 * {
 *   'product.id': 231
 * }
 * */
export function getProductDetails (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/product/getproduct.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}

/**
 * 直接下单
 * @param data
 * {
 *   'order.productid': 6,
 *   'order.buynums': 89,
 *   'order.cust': 1
 * }
 * */
export function placeOrder (data) {
  const url = `${WEB_DOMAIN}/optiontrans/API/trans/order.do`
  const datas = Object.assign({}, data)

  return requery(url, datas, {method: 'get'})
}
