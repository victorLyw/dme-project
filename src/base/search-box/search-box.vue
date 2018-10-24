<template>
  <div class="xftz-search-box">
    <i class="iconfont icon-search"></i>
    <input type="text" class="box" v-model="query" :placeholder="placeholder">
    <i @click="clear" v-show="query" class="iconfont icon-shanchu"></i>
  </div>
</template>

<script>
export default {
  name: 'search-box',
  props: {
    placeholder: {
      type: String,
      default: '搜索商品'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  created () {
    this.$watch('query', (newQuery) => {
      this.$emit('query', newQuery)
    })
  },
  methods: {
    /* 清空输入框内容 */
    clear () {
      this.query = ''
      this.$emit('clear')
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-search-box
  display: flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $color-background-bar-one
  border-radius: 6px
  .icon-search
    font-size: 24px
    color: $color-background
  .box
    flex: 1
    margin: 0 5px
    line-height: 18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium
    &::placeholder
      color: $color-text-d
  .icon-dismiss
    font-size: 16px
    color: $color-background
</style>
