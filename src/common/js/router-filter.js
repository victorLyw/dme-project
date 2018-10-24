import Storage from 'common/js/storage'
import router from '../../router'
import { STATUS_CODE } from 'api/config'
import store from '../../store'
import {getUserSession} from 'api/authorize'
import {COOKIE_NAME} from 'common/js/config'
// import { Toast } from 'we-vue'

export function iterceptRouter () {
  /**
   * 登录拦截
   * */
  router.beforeEach((to, from, next) => {
    // 如果未匹配到路由
    if (to.matched.length === 0) {
      // 如果上级也未匹配到路由则跳转首页，如果上级能匹配到则转上级路由
      from.name ? next({ name: from.name }) : next('/')
      return false
    }
    // 已经获取过授权 并且进入的是登录页面 此处支付页面需要特殊处理
    if (!to.meta.wxAuthor && !to.meta.requiresAuth && !store.state.userInfo && to.path != '/recharge') {
      let userInfo = Storage.getStorage(COOKIE_NAME.userInfo)
      if (!userInfo) {
        next('/login')
        return false
      }
      // 从本地获取用户ID
      let userData = {'cust.id': userInfo.customer.id}
      // 如果不是授权页面 并且 不是需要验证的页面 并且 没有登录信息 则 跳转登录
      getUserSession(userData).then(res => {
        // 如果获取成功
        if (res.status == STATUS_CODE) {
          // 存储用户信息
          Storage.setStorage(COOKIE_NAME.userInfo, res.data)
          store.commit('SET_USERINFO', res.data)
          // 跳转到首页
          next('/')
        }
      })
      next()
      return false
    }
    // 用户使用后退返回到授权页，则默认回到首页
    if (store.state.userInfo && to.meta.requiresAuth) {
      // 用户登录信息已存在 并且 是需验证的页面 则 返回首页
      next('/')
      return false
    }
    // 如果进入的是不需要授权的页面 直接放行
    next()
  })
}
