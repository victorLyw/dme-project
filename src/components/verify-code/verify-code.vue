<template>
  <section class="xftz-verify-code">
    <button @click.prevent="getVerifyCode" v-show="!computedTime">获取验证码</button>
    <button @click.prevent v-show="computedTime">已发送 {{computedTime}}s </button>
  </section>
</template>

<script>
import {verifyCode} from 'api/authorize'
import {formInput} from 'common/js/mixin'
import {STATUS_CODE} from 'api/config'
import {Toast} from 'we-vue'

export default {
  name: 'verify-code',
  mixins: [formInput],
  props: {
    mobile: {
      type: String,
      default: null
    },
    calculagraph: {
      type: Number,
      default: 60
    }
  },
  data () {
    return {
      userInfo: {mobile: ''}, // 验证手机号码用
      computedTime: 0 // 倒计时
    }
  },
  methods: {
    /**
     * 获取验证码
     * */
    getVerifyCode () {
      let mobile = this.mobile
      if (!mobile) {
        Toast.text({
          duration: 1.5 * 1000,
          message: '请输入手机号码'
        })
        return
      }
      if (!this.setMobileCheck(mobile)) {
        Toast.text({
          duration: 1000,
          message: '手机号码不正确'
        })
        return
      }
      let data = {
        'sms.phone': mobile
      }
      verifyCode(data).then(res => {
        if (res.status === STATUS_CODE) {
          this.setCalculagraph()
          Toast.text({
            duration: 1.5 * 1000,
            message: '验证码已发送,请注意查收！'
          })
        }
      })
    },
    setCalculagraph () {
      this.computedTime = this.calculagraph
      this.timer = setInterval(() => {
        this.computedTime--
        if (this.computedTime == 0) {
          clearInterval(this.timer)
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-verify-code
  button
    width 100px
    font-size $font-size-medium
    height $height-input
    line-height $height-input
    margin-right 30px
    background $color-background
    color $color-text
    border 1px solid $color-text
</style>
