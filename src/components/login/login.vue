<template>
  <div class="xftz-login-page">
    <div class="xftz-main">
      <div class="logo-box"></div>
      <div class="login-form">
        <div class="xftz-cell">
          <xftz-cells>
            <xftz-cell>
              <span slot="hd" class="iconfont icon-shoujihao"></span>
              <div slot="bd">
                <input type="tel" placeholder="请输入手机号" v-model="userInfo['cust.phone']" />
              </div>
            </xftz-cell>
            <xftz-cell>
              <span slot="hd" class="iconfont icon-dunpai"></span>
              <div slot="bd">
                <input type="password" placeholder="请输入密码" v-model="userInfo['cust.password']" />
              </div>
            </xftz-cell>
            <xftz-cell>
              <span slot="hd" @click="_toBuildPath('/register')">用户注册</span>
              <div slot="ft" @click="_toBuildPath('/forget')">忘记密码？</div>
            </xftz-cell>
          </xftz-cells>
        </div>
        <div class="confirm-login">
          <wv-button type="warn" @click="_confirmLogin">登录</wv-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formInput, getUserOpenId} from 'common/js/mixin'
import {login} from 'api/authorize'
// import {getUserAccount} from 'api/account'
import {STATUS_CODE} from 'api/config'
import {Toast} from 'we-vue'
import {COOKIE_NAME} from 'common/js/config'

export default {
  name: 'login',
  mixins: [formInput, getUserOpenId],
  data () {
    return {
      wxInfo: null, // 微信信息
      userInfo: { // 用户信息
        'cust.phone': '', // 手机号
        'cust.password': '' // 密码
      }
    }
  },
  methods: {
    /* ==== 用户登录 ====  */
    async _confirmLogin () {
      let userInfo = this.userInfo
      if (!this.wxInfo) {
        Toast.fail('请使用微信浏览器打开')
        return
      }
      // 注册信息注入微信 openid
      userInfo['cust.openid'] = this.wxInfo.openid
      for (let key in userInfo) {
        if (!userInfo[key]) {
          Toast.text({
            duration: 1000,
            message: '请将信息填写完整'
          })
          return
        }
      }
      if (!this.rightPhoneNumber) {
        Toast.text({
          duration: 1000,
          message: '手机号码不正确'
        })
        return
      }
      login(userInfo).then(res => {
        // 登录成功获取登录信息
        if (res.status == STATUS_CODE) {
          // 清除输入信息
          this.clearInfo(userInfo)
          // 存储到本地
          this.$storage.setStorage(COOKIE_NAME.userInfo, res.data)
          // 获取用户信息账户成功存储到变量
          this.$store.commit('SET_USERINFO', res.data)
          // 登录成功跳转到主页
          this.$router.push({path: '/'})
          // 获取账户信息 TODO
          /*
          getUserAccount().then(res => {
            if (res.status == STATUS_CODE) {
              // 获取用户信息账户成功
              this.$store.commit('SET_USERACCOUNT', res.data)
            }
          })
          */
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.xftz-login-page
  pos-fixed-screen()
  bg-image('~common/images/login-bg')
  .xftz-main
    .logo-box
      width 100px
      height 100px
      border-radius 50%
      margin 2em auto 4em auto
      bg-image('~common/images/logo')
      background-size cover
      text-indent -1000em
    .confirm-login
      margin-top 40px
</style>
