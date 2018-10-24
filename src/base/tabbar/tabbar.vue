<template>
  <div id="tabBar">
    <wv-tabbar id="navBar">
      <wv-tabbar-item to="/optional" :class="$route.path.indexOf('optional') !== -1? 'weui-bar__item_on' : ''">
        <span class="weui-tabbar__icon iconfont icon-shangpin" slot="icon"></span>
        商品
      </wv-tabbar-item>
      <wv-tabbar-item to="/order" :class="$route.path.indexOf('order') !== -1? 'weui-bar__item_on' : ''">
        <span class="weui-tabbar__icon iconfont icon-jiaoyi" slot="icon"></span>
        交易
      </wv-tabbar-item>
      <wv-tabbar-item to="/myinfo" :class="$route.path.indexOf('myinfo') !== -1? 'weui-bar__item_on' : ''">
        <span class="weui-tabbar__icon iconfont icon-wode" slot="icon"></span>
        我的
      </wv-tabbar-item>
    </wv-tabbar>
  </div>
</template>

<script>
export default {
  name: 'tabbar'
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

#tabBar
  .weui-tabbar /deep/
    background $color-background-f
    .weui-bar__item_on
      .weui-tabbar__label, .weui-tabbar__icon
        color $txticon-color-select
    .iconfont
      font-size 22px
</style>
