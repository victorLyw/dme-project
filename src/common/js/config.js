/**
 * 配置线上环境和线下环境的切换
 */

let WEB_DOMAIN = '' // 主域名
let PRIVATEKEY = '' // 与服务器约定的Privatekey 用于生成sign
let AUTHOR_API = '' // 鉴权
let WX_API = '' // 微信api
let APP_ID = '' // 微信appID
let SNS_SCOPE = '' // 微信auth2.0 scope参数
let COOKIE_NAME = {
  weChat: 'weChatN',
  weChatInfo: 'weChatInfoN',
  userInfo: 'userInfoN'
}

if (process.env.NODE_ENV == 'development') { // 测试环境
  WEB_DOMAIN = ''
  AUTHOR_API = 'dev'
  WX_API = 'https://open.weixin.qq.com'
  APP_ID = ''
  SNS_SCOPE = 'snsapi_base'
} else if (process.env.NODE_ENV == 'production') { // 生产环境
  WEB_DOMAIN = ''
  AUTHOR_API = ''
  WX_API = 'https://open.weixin.qq.com'
  APP_ID = ''
  SNS_SCOPE = 'snsapi_base'
}

export {
  WEB_DOMAIN,
  PRIVATEKEY,
  AUTHOR_API,
  WX_API,
  APP_ID,
  SNS_SCOPE,
  COOKIE_NAME
}
