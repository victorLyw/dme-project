<template>
  <div class="xftz-cash-page">
    <head-top headTitle="提现">
    </head-top>
    <div class="xftz-cont">
      <div class="recharge-money">
        <div class="recharge-cont">
          <i class="xftz-txt-danger iconfont icon-tixian"></i>
          <span>提现金额</span>
        </div>
        <div class="recharge-money-input">
          <span>￥</span>
          <span class="recharge-span">
            <input type="number" placeholder="请输入提现金额" v-model="amountMoney" class="recharge-input" />
          </span>
          <span class="xftz-txt-warn" @click="_withdrawDepositAll">全部取出</span>
        </div>
        <div class="cash-service-fee">
          手续费 0.00
        </div>
        <div class="cash-frozenamount xftz-txt-warn" v-if="userAccount">
          <span v-if="userAccount.forzenamount">已申请提现金额：￥ {{userAccount.forzenamount}}</span>
        </div>
      </div>
      <div class="cash-info">
        <xftz-cells>
          <xftz-cell><div slot="hd">
              <i class="iconfont icon-yaoqingma"></i>
              <span>帐号信息</span>
          </div></xftz-cell>
          <xftz-cell v-if="userAccount">
            <div slot="hd">
              <input type="number" placeholder="验证码" v-model="userInfo['sms.valcode']" />
            </div>
            <span slot="ft">
            <verify-code :calculagraph="60" :mobile="userAccount.customer.phone">
            </verify-code>
          </span>
          </xftz-cell>
        </xftz-cells>
      </div>
      <div class="recharge-notice">
        <span>请仔细核对提现金额，再点击提现</span>
      </div>
      <div class="recharge-confirm">
        <wv-button type="warn" :disabled="isCashDisabled" @click="_confirmCash">
          <i class="iconfont icon-tixian"></i>
          <span>提现</span>
        </wv-button>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from 'base/header/head'
import xftzCells from 'base/xftz-cells/xftz-cells'
import xftzCell from 'base/xftz-cell/xftz-cell'
import verifyCode from 'components/verify-code/verify-code'
import {baseFun} from 'common/js/mixin'
import {accountsWithdraw} from 'api/account'
import {Dialog, Toast} from 'we-vue'
import {STATUS_CODE} from 'api/config'

export default {
  name: 'cash',
  mixins: [baseFun],
  data () {
    return {
      userAccount: null,
      amountMoney: '',
      isCashDisabled: false,
      userInfo: {
        'sms.valcode': ''
      }
    }
  },
  activated () {
    this.getUserAccount()
  },
  methods: {
    /* ==== 提现 ==== */
    _confirmCash () {
      if (!this.userAccount) {
        Toast.text({
          duration: 1.5 * 1000,
          message: '用户信息不正确,请重新登录'
        })
        return
      }
      if (!this.userAccount.bankcard) {
        Dialog.confirm({
          title: '温馨提示',
          message: '您还没有绑定银行卡，点击绑定',
          skin: 'ios',
          showCancelButton: false
        }).then(() => {
          // 跳转银行卡页面
          this.$router.push('/bankcard')
        })
        return
      }
      if (!this.amountMoney || !this.userInfo['sms.valcode']) {
        Toast.text({
          duration: 1000,
          message: '请将信息填写完整'
        })
        return
      }
      // 检查是否存在正在提现余额
      let accountBalance = this.userAccount.customer.balance
      if (this.userAccount.forzenamount) {
        let balances = (this.userAccount.customer.balance) - (this.userAccount.forzenamount)
        if (balances > 0) {
          accountBalance = balances
        } else {
          Toast.text({
            duration: 1000,
            message: '可用余额不足'
          })
          return
        }
      }
      if (parseFloat(this.amountMoney) > parseFloat(accountBalance)) {
        Toast.text({
          duration: 1.5 * 1000,
          message: '可用余额不足'
        })
        return
      }
      let data = {
        'draw.custid': this.userAccount.customer.id,
        'draw.amount': this.amountMoney,
        'sms.valcode': this.userInfo['sms.valcode']
      }
      accountsWithdraw(data).then(res => {
        if (res.status == STATUS_CODE) {
          // 清空输入框
          this.amountMoney = ''
          this.userInfo['sms.valcode'] = ''
          // 提现成功跳转资金明细
          this.$router.push('/account')
          // 更新账户信息
          // this._getUserAccountInfo()
          Toast.success('已提交申请,请耐心等待')
        }
      })
    },
    /* ==== 全部取出 ==== */
    _withdrawDepositAll () {
      if (!this.userAccount) {
        Toast.text({
          duration: 1.5 * 1000,
          message: '请返回重试'
        })
        return
      }
      if (!this.userAccount.bankcard) {
        Dialog.confirm({
          title: '温馨提示',
          message: '您还没有绑定银行卡，点击绑定',
          skin: 'ios',
          showCancelButton: false
        }).then(() => {
          // 跳转银行卡页面
          this.$router.push('/bankcard')
        })
        return
      }
      // 检查是否有正在提现金额
      if (this.userAccount.forzenamount) {
        let balance = (this.userAccount.customer.balance) - (this.userAccount.forzenamount)
        if (balance > 0) {
          this.amountMoney = balance
        } else {
          Toast.text({
            duration: 1000,
            message: '可用余额不足'
          })
        }
      } else {
        this.amountMoney = this.userAccount.customer.balance
      }
    }
  },
  components: {
    headTop,
    xftzCells,
    xftzCell,
    verifyCode
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-cash-page
  .recharge-money
    margin 26px 20px
    text-align left
    .recharge-cont
      font-size 1.4em
      margin 10px 0
      .iconfont
        font-size 1em
    .recharge-money-input
      margin-top 20px
      line-height $height-input
      display flex
      .recharge-span
        flex 1
        font-size 1.4em
        border-bottom 1px solid $border-color-list
        .recharge-input
          outline none
          background-color transparent
    .cash-frozenamount
      margin 10px 0
  .cash-service-fee
    margin-top 20px
  .recharge-notice
    margin-top 40px
    color $color-text-l
    line-height 24px
    font-size 14px
    padding 0 20px
  .recharge-confirm
    margin-top 20px
    padding 0 20px
</style>
