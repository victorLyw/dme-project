<template>
  <div class="xftz-settings-page">
    <head-top headTitle="设置">
    </head-top>
    <div class="xftz-cont">
      <div class="settings-header">
        <div class="user-photo">
          <img src="../../common/images/logo@2x.png" alt="userPhoto">
        </div>
        <div class="user-info">
          <p class="userInfo-item" v-if="userAccount">{{userAccount.customer.name}}</p>
        </div>
      </div>
      <div class="settings-option">
        <xftz-cells>
          <xftz-cell>
            <div slot="hd">手机号码</div>
            <div slot="ft">
              <span class="xftz-txt-warn" v-if="userAccount">{{userAccount.customer.showphone}}</span>
              <span class="iconfont icon-youjiantou"></span>
            </div>
          </xftz-cell>
          <!--
          <xftz-cell>
            <div slot="hd">微信号</div>
            <div slot="ft" v-if="userAccount">
              <span class="xftz-txt-success" v-if="userAccount.customer.openid" @click="userReleaseBind">申请解绑微信号</span>
              <span class="xftz-txt-danger" v-else>未绑定</span>
            </div>
          </xftz-cell>
          -->
          <div @click="popupVisible = true">
            <xftz-cell>
              <div slot="hd">修改密码</div>
              <div slot="ft">
                <span class="iconfont icon-youjiantou"></span>
              </div>
            </xftz-cell>
          </div>
        </xftz-cells>
      </div>
      <div class="settings-checkout">
        <xftz-cells>
          <xftz-cell><div @click="checkOutLogin" slot="bd">退出登录</div></xftz-cell>
        </xftz-cells>
      </div>
      <!-- 修改密码 -->
      <div class="settings-forget">
        <popup :popupTitle="'修改密码'" :popupVisible="popupVisible" :popupData="[]">
          <div slot="close" @click="popupVisible = false">关闭</div>
          <div slot="edit" @click="popupVisible = false">取消</div>
          <div slot="popupElse">
            <xftz-cells>
              <xftz-cell>
                <div slot="bd">
                  <input type="password" v-model="userInfo['cust.password']" placeholder="请输入密码">
                </div>
              </xftz-cell>
              <xftz-cell>
                <div slot="bd">
                  <input type="password" v-model="repassword" placeholder="请再次输入密码">
                </div>
              </xftz-cell>
              <xftz-cell>
                <div slot="bd">
                  <input type="number" v-model="userInfo['sms.valcode']" placeholder="请输入验证码">
                </div>
                <div slot="ft" v-if="userAccount">
                  <verify-code :calculagraph="120" :mobile="userAccount.customer.phone">
                  </verify-code>
                </div>
              </xftz-cell>
              <xftz-cell>
                <div slot="bd">
                  <wv-button type="warn" @click="_confirmForget">确认修改</wv-button>
                </div>
              </xftz-cell>
            </xftz-cells>
          </div>
        </popup>
      </div>
      <!-- End 修密码 -->
    </div>
  </div>
</template>

<script>
import headTop from 'base/header/head'
import xftzCells from 'base/xftz-cells/xftz-cells'
import xftzCell from 'base/xftz-cell/xftz-cell'
import popup from 'base/popup/popup'
import verifyCode from 'components/verify-code/verify-code'
import {baseFun} from 'common/js/mixin'
import {forgetPassword} from 'api/authorize'
import {STATUS_CODE} from 'api/config'
import {Dialog, Toast} from 'we-vue'
import {COOKIE_NAME} from 'common/js/config'

export default {
  name: 'settings',
  mixins: [baseFun],
  data () {
    return {
      userAccount: null,
      popupVisible: false,
      userInfo: {
        'cust.password': '',
        'sms.valcode': ''
      },
      repassword: ''
    }
  },
  activated () {
    this.getUserAccount()
  },
  methods: {
    /* ==== weChatReleaseBind 解绑微信 ==== */
    /*
    userReleaseBind () {
      Dialog.confirm({
        title: '温馨提示',
        message: '确定要申请解除绑定吗？',
        skin: 'ios',
        showCancelButton: true
      }).then(() => {
        let data = {'cust.id': this.userAccount.customer.id}
        weChatReleaseBind(data).then(res => {
          if (res.status == STATUS_CODE) {
            Toast.success('申请已提交，请耐心等待')
            this.getUserAccount()
          }
        })
      }).catch(() => {
      })
    },
    */
    /* ==== _confirmForget 修改密码 ==== */
    _confirmForget () {
      if (!this.userAccount) {
        Toast.text({
          duration: 1000,
          message: '获取用户信息失败'
        })
        return
      }
      for (let key in this.userInfo) {
        if (!this.userInfo[key]) {
          Toast.text({
            duration: 1000,
            message: '请将信息填写完成'
          })
          return
        }
      }
      if (this.userInfo['cust.password'] !== this.repassword) {
        Toast.text({
          duration: 1000,
          message: '两次密码不一样'
        })
        return
      }
      // 添加用户id
      this.userInfo['cust.id'] = this.userAccount.customer.id
      forgetPassword(this.userInfo).then(res => {
        if (res.status == STATUS_CODE) {
          Toast.text({
            duration: 1000,
            message: '修改成功'
          })
          // 清除用户信息
          this.$store.commit('SET_USERINFO', null)
          this.$store.commit('SET_USERACCOUNT', null)
          // 返回登录
          this.$router.push('/login')
        }
      })
    },
    /* ==== checkOutLogin 退出登录 ==== */
    checkOutLogin () {
      Dialog.confirm({
        title: '温馨提示',
        message: '确定要退出吗？',
        skin: 'ios',
        showCancelButton: true
      }).then(() => {
        // 清空所有 storage
        for (let key in COOKIE_NAME) {
          this.$storage.removeStorage(COOKIE_NAME[key])
        }
        // 清除用户信息
        this.$store.commit('SET_USERINFO', null)
        this.$store.commit('SET_USERACCOUNT', null)
        // 返回登录
        this.$router.push('/login')
        Toast.text({
          duration: 2.5 * 1000,
          message: '成功退出'
        })
      }).catch(() => {
      })
    }
  },
  components: {
    headTop,
    xftzCells,
    xftzCell,
    popup,
    verifyCode
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-settings-page
  .settings-header
    display flex
    align-items center
    position relative
    padding 15px
    margin-top 10px
    background-color $color-background-gr
    .user-photo
      width 60px
      height 60px
      margin-right 15px
      border-radius 50%
      box-shadow 0 0 6px $border-color-navbar
      img
        width 100%
  .settings-option
    .xftz-cells /deep/
      border-radius 0
      .xftz-cell__ft
        right 10px
</style>
