<template>
  <div class="xftz-fotget-page">
    <head-top headTitle="修改密码" :goBack="true" :edit="false">
    </head-top>
    <div class="xftz-main">
      <xftz-cells>
        <xftz-cell>
          <span slot="hd" class="iconfont icon-shoujihao"></span>
          <div slot="bd">
            <input type="tel" placeholder="请输入手机号" v-model="userMobile" />
          </div>
        </xftz-cell>
        <xftz-cell>
          <span slot="hd" class="iconfont icon-sousuoxiawu-"></span>
          <div slot="bd">
            <input type="number" placeholder="验证码" v-model="userInfo['sms.valcode']" />
          </div>
          <span slot="ft">
            <verify-code :calculagraph="60" :mobile="userMobile">
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
      <div class="forget-password">
        <wv-button type="warn" @click="_forgetPassword">确认修改</wv-button>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from 'base/header/head'
import {formInput, getUserOpenId} from 'common/js/mixin'
import verifyCode from 'components/verify-code/verify-code'
import {passwordLost} from 'api/authorize'
import {STATUS_CODE} from 'api/config'
import {Toast} from 'we-vue'

export default {
  name: 'forget',
  mixins: [formInput, getUserOpenId],
  data () {
    return {
      wxInfo: null, // 微信信息
      userMobile: '', // 用户手机号
      userInfo: { // 用户信息
        'cust.password': '', // 密码
        'sms.valcode': '' // 验证码
      },
      repassword: '' // 确认密码
    }
  },
  methods: {
    /* 修改密码 */
    async _forgetPassword () {
      let userInfo = this.userInfo
      if (!this.wxInfo) {
        Toast.fail('请使用微信浏览器打开')
        return
      }
      // 添加用户id
      userInfo['cust.id'] = this.wxInfo.data.data.customer.id
      for (let key in userInfo) {
        if (!userInfo[key]) {
          Toast.text({
            duration: 1000,
            message: '请将信息填写完整'
          })
          return
        }
      }
      if (this.repassword !== userInfo['cust.password']) {
        Toast.fail({
          duration: 1.5 * 1000,
          message: '两次密码不一致'
        })
        return
      }
      passwordLost(userInfo).then(res => {
        if (res.status == STATUS_CODE) {
          Toast.success('修改成功')
          // 清除输入信息
          this.userMobile = ''
          this.clearInfo(userInfo)
          this.repassword = ''
          // 跳转登录
          this._toBuildPath('/login')
        }
      })
    }
  },
  components: {
    headTop,
    verifyCode
  }
}
</script>

<style scoped lang="stylus">
.xftz-fotget-page
  .forget-password
    margin-top 40px
</style>
