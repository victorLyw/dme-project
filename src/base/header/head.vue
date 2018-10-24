<template>
  <header id="headTop">
    <slot name='logo'></slot>
    <slot name='search'></slot>
    <section class="head-item head_goback" v-if="goBack" @click="$router.go(-1)">
      <span class="iconfont icon-iconfontyoujiantou"></span>
    </section>
    <router-link :to="userInfo? '/register':'/login'" v-if='signinUp' class="head-item head_login">
      <span class="iconfont icon-xuanze" v-if="userInfo"></span>
      <span class="login_span" v-else>登录|注册</span>
    </router-link>
    <section class="head-item title_head ellipsis" v-if="headTitle">
      <span class="title_text">{{headTitle}}</span>
    </section>
    <section class="head-item title_edit" v-if="edit" @click="editClick">
      <slot name="edit"></slot>
    </section>
  </header>
</template>

<script>
export default {
  props: {
    signinUp: {
      type: Boolean,
      default: false
    },
    headTitle: {
      type: String,
      default: 'Title'
    },
    goBack: {
      type: Boolean,
      default: true
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /* ==== 编辑点击 ==== */
    editClick () {
      this.$emit('editClick')
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

#headTop
  display flex
  align-items center
  box-sizing border-box
  background $color-background-h
  width 100%
  height $height-header
  line-height 1
  color $color-text
  position relative
  white-space nowrap
  z-index 500
  padding 0 10px
  margin 0
  .head_goback, .title_edit
    extend-click()
    float left
    font-size $font-size-large-x
    line-height 35px
    font-weight 100
    overflow hidden
  .title_head
    text-align center
    flex 1 1 0
    font-size $font-size-large
  .title_edit
    right 10px
</style>
