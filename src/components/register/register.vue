<template>
  <div class="xftz-register-page">
    <head-top ref="headTop" headTitle="用户注册" :goBack="true" :edit="false">
    </head-top>
    <scroll class="list" ref="list">
      <div class="xftz-main register-wrapper">
        <div class="register-agreement" v-if="isDocRisk || isDocUserPro">
          <doc-risk-hints :isDocRisk="isDocRisk">
            <p class="back-btn" @click="isDocRisk = false">确定</p>
          </doc-risk-hints>
          <doc-user-protocol :isDocUserPro="isDocUserPro">
            <p class="back-btn" @click="isDocUserPro = false">确定</p>
          </doc-user-protocol>
        </div>
        <section v-else>
          <xftz-cells>
            <xftz-cell>
              <span slot="hd" class="iconfont icon-zhanghu"></span>
              <div slot="bd">
                <input type="text" placeholder="请输入真实姓名" v-model="userInfo['cust.name']" />
              </div>
            </xftz-cell>
            <xftz-cell>
              <span slot="hd" class="iconfont icon-yaoqingma"></span>
              <div slot="bd">
                <input type="number" placeholder="推荐人邀请码（必填）" v-model="userInfo['cust.invitor']" />
              </div>
            </xftz-cell>
            <xftz-cell>
              <span slot="hd" class="iconfont icon-shoujihao"></span>
              <div slot="bd">
                <input type="tel" placeholder="请输入手机号" v-model="userInfo['cust.phone']" />
              </div>
            </xftz-cell>
            <xftz-cell>
              <span slot="hd" class="iconfont icon-sousuoxiawu-"></span>
              <div slot="bd">
                <input type="number" placeholder="验证码" v-model="userInfo['sms.valcode']" />
              </div>
              <span slot="ft">
            <verify-code :calculagraph="60" :mobile="userInfo['cust.phone']">
            </verify-code>
          </span>
            </xftz-cell>
            <xftz-cell>
              <span slot="hd" class="iconfont icon-dunpai"></span>
              <div slot="bd">
                <input type="password" placeholder="请输入密码" v-model="userInfo['cust.password']" />
              </div>
            </xftz-cell>
            <xftz-cell>
              <span slot="hd" class="iconfont icon-dunpai"></span>
              <div slot="bd">
                <input type="password" placeholder="请再次输入密码" v-model="repassword" />
              </div>
            </xftz-cell>
          </xftz-cells>
          <div class="back-login-btn" @click="_toBuildPath('/login')">已有账号？返回登录</div>
          <div class="protocol-box">
            <span class="agreement-ico iconfont icon-xuanze" @click="_registerAgreement" :class="{'reg-agr-select': isRegisterAgreement}"></span>
            <span class="agreement-txt">
            我已阅读并同意 <a href="javascript:void(0)" @click="isDocUserPro = true">《用户委托协议》</a>和
            <a href="javascript:void(0)" @click="isDocRisk = true">《风险揭示书》</a>
          </span>
          </div>
          <div class="confirm-register">
            <wv-button type="warn" @click="_confirmRegister">立即注册</wv-button>
          </div>
        </section>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from 'base/scroll/scroll'
import headTop from 'base/header/head'
import {formInput, getUserOpenId} from 'common/js/mixin'
import docRiskHints from './doc-risk-hints'
import docUserProtocol from './doc-user-protocol'
import verifyCode from 'components/verify-code/verify-code'
import {register} from 'api/authorize'
import {STATUS_CODE} from 'api/config'
import {COOKIE_NAME} from 'common/js/config'
import {Toast, Dialog} from 'we-vue'

export default {
  name: 'register',
  mixins: [formInput, getUserOpenId],
  data () {
    return {
      wxInfo: null, // 微信信息
      userInfo: { // 用户信息
        'cust.name': '', // 用户名
        'cust.invitor': '', // 邀请码
        'cust.phone': '', // 手机号
        'sms.valcode': '', // 验证码
        'cust.password': '' // 密码
      },
      remobile: '', // 临时存储手机号
      repassword: '', // 确认密码
      isRegisterAgreement: false, // 注册协议
      isDocRisk: false, // 风险揭示
      isDocUserPro: false // 用户委托协议
    }
  },
  mounted () {
    this.$nextTick(() => {
      let Header = document.getElementById('headTop').offsetHeight
      this.$refs.list.$el.style.top = `${Header}px`
    })
  },
  methods: {
    /* 注册协议 */
    _registerAgreement () {
      this.isRegisterAgreement = !this.isRegisterAgreement
    },
    /* 用户注册 */
    async _confirmRegister () {
      let userInfo = this.userInfo
      if (!this.wxInfo) {
        Toast.fail('请使用微信浏览器打开')
        return
      }
      // 注册信息注入微信 openid
      userInfo['cust.openid'] = this.wxInfo.openid
      if (!this.isRegisterAgreement) {
        Toast.text({
          duration: 1.5 * 1000,
          message: '请勾选注册协议'
        })
        return
      }
      for (let key in userInfo) {
        if (!userInfo[key]) {
          Toast.text({
            duration: 1000,
            message: '请将信息填写完整'
          })
          return
        }
      }
      if (this.repassword !== this.userInfo['cust.password']) {
        Toast.fail({
          duration: 1.5 * 1000,
          message: '两次密码不一致'
        })
        return
      }
      register(userInfo).then(res => {
        if (res.status == STATUS_CODE) {
          // 将请求到的code存储到storage
          this.$storage.setStorage(COOKIE_NAME.userInfo, res.data)
          Dialog.confirm({
            title: '提示',
            message: '恭喜你, 注册成功！',
            skin: 'ios',
            showCancelButton: false
          }).then(() => {
            // 清除输入信息
            this.clearInfo(userInfo)
            this.repassword = ''

            // 跳转到登录
            this.$router.push('/login')
          }).catch(() => {
            console.log('注册失败,未知错误')
          })
        } else if (res.status == 102) {
          Toast.fail({
            duration: 1.5 * 1000,
            message: '该用户已存在,试试忘记密码'
          })
        }
      })
    }
  },
  components: {
    scroll,
    headTop,
    verifyCode,
    docRiskHints,
    docUserProtocol
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-register-page
  .back-login-btn
    margin-top 20px
  .protocol-box
    margin-top 20px
    .agreement-txt
      line-height 1.5em
      a
        color $txt-color-select
    .agreement-ico
      extend-click()
      display inline-block
      font-size 1.5em
      margin-right 5px
      color #666
    .reg-agr-select
      color $txt-color-select
  .confirm-register
    margin-top 40px
  .list
    position fixed
    bottom 0
    width 100%
    background $color-background
  .register-agreement
    font-size $font-size-medium
    line-height $font-size-large
    .back-btn
      height $height-nav-two
      text-align center;
      line-height $height-nav-two
      border-radius 8px
      background $color-sub-theme
      width 100%
      min-width 220px
</style>
