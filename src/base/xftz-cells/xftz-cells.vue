<template>
  <div class="xftz-cells">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'xftz-cells'
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-cells
  margin-top 1.17647em
  background-color $color-background-cells
  line-height 1.47059
  font-size $font-size-large
  position relative
  overflow hidden
  border-radius 6px
  .xftz-cell:last-child
    border-bottom 0
  &:after, &:before
    content " "
    position absolute
    left 0
    right 0
    height 1px
    color $border-color-list
    z-index 2
</style>
