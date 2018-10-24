<template>
  <div class="xftz-myinfo-page">
    <head-top headTitle="我的">
    </head-top>
    <scroll class="list" ref="list">
      <div class="xftz-cont">
        <div class="myinfo-header">
          <div class="info-pic">
            <div class="user-photo">
              <img src="../../common/images/logo@2x.png" alt="userPhoto">
            </div>
            <div class="userInfo">
              <p class="userInfo-item" v-if="userAccount">{{userAccount.customer.name}}</p>
              <p class="userInfo-item" v-if="userAccount">{{userAccount.customer.showphone}}</p>
            </div>
          </div>
          <div class="settings" @click="$router.push('/settings')"><i class="iconfont icon-iconshezhi"></i></div>
          <div class="myinfo-balance">
            <div class="balance-info">
              <div class="balance-label">账户余额</div>
              <div class="balance-price" v-if="userAccount">￥ {{userAccount.customer.balance}}</div>
            </div>
            <div class="balance-option">
              <router-link tag="div" to="/recharge" class="option__item">
                <span class="iconfont icon-recharge"></span>
                <span>充值</span>
              </router-link>
              <router-link tag="div" to="/cash" class="option__item">
                <span class="iconfont icon-tixian"></span>
                <span>提现</span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="myinfo-option">
          <xftz-cells>
            <router-link tag="div" to="/account">
              <xftz-cell>
                <div slot="hd">
                  <span class="xftz-txt-warn iconfont icon-zhanghu"></span>
                  <span>我的账户</span>
                </div>
                <div slot="ft">
                  <span class="xftz-txt-danger" v-if="userAccount">￥ {{userAccount.customer.balance}}</span>
                  <span class="iconfont icon-youjiantou"></span>
                </div>
              </xftz-cell>
            </router-link>
            <router-link tag="div" to="/bankcard">
              <xftz-cell>
                <div slot="hd">
                  <span class="xftz-txt-info iconfont icon-icon-copy"></span>
                  <span>绑定银行卡</span>
                </div>
                <div slot="ft" v-if="userAccount">
                  <span class="xftz-txt-success" v-if="userAccount.bankcard.id!==0">已绑定</span>
                  <span class="xftz-txt-danger" v-else>未绑定</span>
                  <span class="iconfont icon-youjiantou"></span>
                </div>
              </xftz-cell>
            </router-link>
          </xftz-cells>
        </div>
      </div>
    </scroll>
    <tab-bar>
    </tab-bar>
  </div>
</template>

<script>
import headTop from 'base/header/head'
import tabBar from 'base/tabbar/tabbar'
import xftzCells from 'base/xftz-cells/xftz-cells'
import xftzCell from 'base/xftz-cell/xftz-cell'
import scroll from 'base/scroll/scroll'
import {baseFun} from 'common/js/mixin'

export default {
  name: 'myinfo',
  mixins: [baseFun],
  data () {
    return {
      userAccount: null
    }
  },
  mounted () {
    let Header = document.getElementById('headTop').offsetHeight
    let BottomH = document.getElementById('navBar').offsetHeight
    this.$refs.list.$el.style.top = `${Header}px`
    this.$refs.list.$el.style.bottom = `${BottomH}px`
  },
  activated () {
    this.getUserAccount()
  },
  components: {
    headTop,
    tabBar,
    xftzCells,
    xftzCell,
    scroll
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.xftz-myinfo-page
  .list
    position fixed
    bottom 0
    width 100%
    background $color-background
  .myinfo-header
    bg-image('~common/images/userinfo-bg')
    padding 30px 10px 0 10px
    margin-bottom 50px
    position relative
    .info-pic
      display flex
      align-items center
      position relative
      padding-left 10px
      .user-photo
        width 80px
        height 80px
        margin-right 15px
        border-radius 50%
        box-shadow 0 0 6px $border-color-navbar
        img
          width 100%
      .userInfo-item
        padding 5px 0
        text-align left
    .myinfo-balance
      position relative
      margin-top 20px
      .balance-info
        background-color $color-text-l
        color rgba(0,0,0,.7)
        overflow hidden
        text-align left
        .balance-label
          height 55px
          line-height 55px
          font-size 1.2em
          font-weight bold
          padding-left 10px
        .balance-price
          padding 5px 0
          font-size 2em
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
      .balance-option
        width 100%
        height 45px
        line-height 45px
        bottom -45px
        position absolute
        display flex
        .option__item
          flex 1
          background-color $color-background-f
          &:first-child
            border-right 2px solid $border-color-list
    .settings
      position absolute
      top 20px
      right 20px
      font-size 1.5em
      .iconfont
        font-size 1.2em
  .myinfo-option
    position relative
    top 10px
    .xftz-cells /deep/
      border-radius 0
      .xftz-cell
        .xftz-cell_hd
          font-size 16px
        .xftz-cell__ft
          right 10px
</style>
