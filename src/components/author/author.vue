<template>
  <div>
    <loading :title="'加载中...'">
    </loading>
  </div>
</template>

<script>
import {getQueryString} from 'common/js/utils'
import {getWeChatOpenId} from 'api/authorize'
import {COOKIE_NAME} from 'common/js/config'
import Loading from 'base/loading/loading'
import {Toast} from 'we-vue'
import {STATUS_CODE} from 'api/config'

export default {
  name: 'author',
  created () {
    // 检测会员有没有登录
    let weChatC = getQueryString('code')
    let weChatS = getQueryString('state')
    let weChat = this.$storage.getStorage(COOKIE_NAME.weChat)
    if (!weChatC && !weChatS) {
      if (!weChat) {
        // 检测是否在微信浏览器环境
        let ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          // 如果没有code, 获取微信用户 code
          // getWeChatCode()
        } else {
          Toast.fail({
            duration: 1000,
            message: '请使用微信打开'
          })
        }
      }
    } else {
      let weChat = {
        weChatC: weChatC,
        weChatS: weChatS
      }
      // 将请求到的code存储到storage
      this.$storage.setStorage(COOKIE_NAME.weChat, weChat)
      let data = {code: weChatC}
      // 获取用户信息
      getWeChatOpenId(data).then(res => {
        if (res.status == STATUS_CODE) {
          // 将请求到的微信openID存储到storage
          this.$storage.setStorage(COOKIE_NAME.weChatInfo, res)
          if (res.data.data) { // 判断用户数据是否存在
            // 存储到本地
            this.$storage.setStorage(COOKIE_NAME.userInfo, res.data.data)
            // 获取用户信息账户成功存储到变量
            this.$store.commit('SET_USERINFO', res.data.data)
            if (res.data.data.openid) { // 如果用户已绑定微信号
              // 登录成功跳转到主页
              this.userToPath('login')
            } else { // 未绑定需要跳转到登录进行绑定
              // 登录成功跳转到登录页
              this.userToPath('login')
            }
          } else {
            // 如果是已注册用户跳转登录否则跳转注册
            this.userToPath('register')
          }
        }
        if (res.status == 101) {
          // 如果是已注册用户跳转登录否则跳转注册
          this.userToPath('register')
        }
      })
    }
  },
  methods: {
    /* 清除url获取的code信息 并且跳转到登录 */
    userToPath (path) {
      let pageUrl = window.location.href.split('/?')[0]
      /* eslint-disable no-undef */
      location.href = pageUrl + '/#/' + path
    }
  },
  components: {
    Loading
  }
}
</script>
