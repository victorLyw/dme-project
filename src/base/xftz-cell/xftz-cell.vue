<template>
  <div class="xftz-cell">
    <div class="xftz-cell_hd">
      <slot name="hd"></slot>
    </div>
    <div class="xftz-cell__bd">
      <slot name="bd"></slot>
    </div>
    <div class="xftz-cell__ft">
      <slot name="ft"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'xftz-cell'
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .xftz-cell
    padding 10px 15px
    position relative
    border-bottom 1px solid $border-color-list
    display -webkit-box
    display -webkit-flex
    display flex
    -webkit-box-align center
    -webkit-align-items center
    align-items center
    .xftz-cell__bd
      flex 1
      padding 0 20px
    .xftz-cell__ft
      text-align right
      position absolute
      right 0
      color $txt-color-two
</style>
