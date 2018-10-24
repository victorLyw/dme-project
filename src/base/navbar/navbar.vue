<template>
  <div class="xftz-navbar-page">
    <div class="xftz-navbar" ref="navBarTheme">
      <div class="xftz-navbar-item"
           :class="{'select-item': item.isSelect}"
           v-if="!isSub || isSub&&itemList.length > 1"
           v-for="(item, index) in itemList" :key="index"
           @click="itemChange(item)">
        {{item[itemKey]}}
      </div>
    </div>
    <slot>
    </slot>
  </div>
</template>

<script>
import {baseFun} from 'common/js/mixin'
export default {
  name: 'navbar',
  mixins: [baseFun],
  props: {
    itemList: {
      type: Array,
      default: null
    },
    itemKey: {
      type: String,
      default: ''
    },
    isSub: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'default'
    }
  },
  mounted () {
    if (this.theme) {
      let refsObj = this.$refs.navBarTheme
      if (this.theme === 'red') {
        refsObj.className = this.addClass(refsObj, 'theme-' + this.theme)
      }
    }
  },
  methods: {
    /* 选项卡数据 */
    itemChange (items) {
      if (items.isSelect) return
      this.itemList.forEach(item => {
        item.isSelect = (item[this.itemKey] === items[this.itemKey])
      })
      this.$emit('selectChange', items)
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-navbar-page
  .xftz-navbar
    display flex
    width 100%
    z-index 500
    background-color $color-background-bar-two
    position relative
    .xftz-navbar-item
      position relative
      display block
      flex 1
      font-size $font-size-large
      height $height-nav-two
      line-height $height-nav-two
      text-align center
    .select-item
      border-bottom 2px solid $txt-color-select
      color $txt-color-select
  .theme-red
    border-bottom 1px solid $border-color-list
    .select-item
      border-bottom-color transparent
      color $color-sub-theme
</style>
