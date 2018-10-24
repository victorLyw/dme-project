<template>
  <div class="xftz-recharge-page">
    <head-top headTitle="充值">
    </head-top>
    <div class="xftz-cont">
      <div class="recharge-money">
        <div class="recharge-cont">
          <i class="xftz-txt-warn iconfont icon-recharge"></i>
          <span>充值金额</span>
        </div>
        <div class="recharge-money-input">
          <span>￥</span>
          <span class="recharge-span">
            <input type="number" placeholder="请输入充值金额" v-model="amountMoney" class="recharge-input" />
          </span>
          <span>元</span>
        </div>
      </div>
      <div class="recharge-notice">
        <span>尊敬的客户，请仔细核对充值金额，再点击充值</span>
      </div>
      <div class="recharge-confirm">
        <wv-button type="warn" :disabled="rechargeDisabled" @click="_confirmRecharge">
          <i class="iconfont icon-recharge"></i>
          <span>立即充值</span>
        </wv-button>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from 'base/header/head'
import {baseFun} from 'common/js/mixin'
import {Toast} from 'we-vue'
import {accountsCharge} from 'api/account'
import {STATUS_CODE} from 'api/config'

export default {
  name: 'recharge',
  mixins: [baseFun],
  data () {
    return {
      userAccount: null, // 用户信息
      amountMoney: '', // 充值金额
      rechargeDisabled: false // 是否禁用充值按钮
    }
  },
  created () {
    // 初始化环境
    this._configEnvironment()
  },
  activated () {
    this.amountMoney = ''
    this.getUserAccount()
  },
  methods: {
    /* ==== 充值 ==== */
    _confirmRecharge () {
      if (!this.amountMoney) {
        Toast.text({
          duration: 1000,
          message: '请输入充值金额'
        })
        return
      }
      if (typeof WeixinJSBridge == 'undefined') {
        Toast.text({
          duration: 2.5 * 1000,
          message: '请使用微信打开'
        })
        return
      }
      // 开始充值禁用充值按钮
      this.rechargeDisabled = true
      let data = {
        'charge.custid': this.userAccount.customer.id,
        'charge.amount': this.amountMoney,
        'charge.chargestyle': 'JSAPI'
      }
      accountsCharge(data).then(res => {
        // 创建订单成功启用充值按钮
        this.rechargeDisabled = false
        if (res.status == STATUS_CODE) {
          console.log(res.data)
          if (res.data.appId) {
            this.weixinPay(res.data)
          } else {
            Toast.fail({
              duration: 1.5 * 1000,
              message: '操作失败,请重新登录'
            })
          }
        }
      })
    },
    /**
     * ==== 微信支付环境 ====
     * @method :微信支付方法
     * @param data
     */
    weixinPay: function (data) {
      let vm = this
      if (typeof WeixinJSBridge == 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(data), false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(data))
          document.attachEvent('onWeixinJSBridgeReady', vm.onBridgeReady(data))
        }
      } else {
        vm.onBridgeReady(data)
      }
    },
    /**
     * @method 支付费用方法
     * @param data:后台返回的支付对象,(详情微信公众号支付API中H5提交支付);
     */
    onBridgeReady: function (data) {
      let vm = this
      // let params = data.params
      let payinfo = data
      // @warn WeixinJSBridge对象只能在微信浏览器使用
      /* eslint-disable no-undef */
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          appId: payinfo.appId,
          timeStamp: payinfo.timeStamp,
          nonceStr: payinfo.nonceStr,
          package: payinfo.package,
          signType: payinfo.signType,
          paySign: payinfo.sign
        },
        function (res) {
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          let getBrandWcpayRequest = res.err_msg.split(':')[1]
          if (getBrandWcpayRequest == 'ok') {
            // 支付成功查询结果
            Toast.success('充值成功')
            // 清空充值金额
            vm.amountMoney = ''
            // 跳转到账户明细
            vm.$router.push('/myinfo')
            /*
            let data = {
              order_no: params.orderNo
            }
            wePayResult(data).then(res => {
              if (res.code == STATUS_CODE) {
                if (res.data.status == '01') {
                  Toast.success('充值成功')
                  // 清空充值金额
                  vm.amountMoney = ''
                  // 跳转到账户明细
                  vm.$router.push('/balance')
                } else {
                  // 清空充值金额
                  vm.amountMoney = ''
                  Toast.fail('充值失败')
                }
              }
            })
            */
          } else if (getBrandWcpayRequest == 'cancel') {
            Toast.text({
              duration: 1.5 * 1000,
              message: '您已取消充值'
            })
            /*
            let data = {
              orderNo: params.orderNo, // 订单号
              accountNo: vm.accountInfo.accountNo // 用户账号
            }
            wxPayCancel(data).then(res => {
              if (res.code == STATUS_CODE) {
                Toast.text({
                  duration: 2.5 * 1000,
                  message: '充值失败'
                })
              }
            })
            */
          } else {
            // 清空充值金额
            vm.amountMoney = ''
            Toast.fail('支付失败,请跳转页面')
          }
        }
      )
    },
    /**
     * 配置环境
     * */
    _configEnvironment () {
      let config = {}
      config.url = window.location.href // 当前页面url
      config.api = 'pay'
      // 判断当前url是否存在?参数匹配符
      if (!config.url.match(/\?/)) {
        location.replace(window.location.href.split('#')[0] + '?' + window.location.hash)
        return
      }
      config.url = encodeURIComponent(config.url)
      // 请求api返回sdk配置参数
    }
  },
  components: {
    headTop
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-recharge-page
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
  .recharge-notice
    margin-top 40px
    color $color-text-l
    line-height 24px
    font-size 14px
    padding 0 20px
  .recharge-confirm
    margin-top 20px
    padding 0 20px
    .weui-btn
      background-color $color-background-btn-warn
</style>
