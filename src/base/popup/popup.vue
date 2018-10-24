<template>
  <div class="xftz-popup">
    <wv-popup :visible.sync="popupVisible" :close-on-click-mask="false" ref="xftzPopup">
      <div class="xftz-popup-data">
        <xftz-cells class="popup-data-switch">
          <xftz-cell>
            <div slot="hd" class="popup-data-cell_hd">
              <slot name="close">
              </slot>
            </div>
            <div slot="bd" class="popup-data-cell_bd">{{popupTitle}}</div>
            <div slot="ft" class="popup-data-cell_ft">
              <slot name="edit">
              </slot>
            </div>
          </xftz-cell>
        </xftz-cells>
        <div class="popup-data-group">
          <slot name="popupElse">
          </slot>
          <div class="popup-flex" v-for="(items, index) in popupData" :key="index">
            <div class="popup-flex-item" v-for="(item, i) in items.subs" :key="i">
              <span class="item-label">{{item.label}}：</span>
              <span>{{item.value}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!popupData">
        <loading></loading>
      </div>
    </wv-popup>
  </div>
</template>

<script>
import loading from 'base/loading/loading'
import xftzCells from 'base/xftz-cells/xftz-cells'
import xftzCell from 'base/xftz-cell/xftz-cell'

export default {
  name: 'popup',
  props: {
    popupData: {
      type: Array,
      default: null
    },
    popupTitle: {
      type: String,
      default: '数据详情'
    },
    popupVisible: {
      type: Boolean,
      default: false
    },
    autoBottomH: {
      type: Boolean,
      default: false
    }
  },
  activated () {
    if (this.autoBottomH) {
      let bottomHeight = document.getElementById('navBar').offsetHeight
      this.$refs.xftzPopup.$el.style.bottom = `${bottomHeight}px`
    }
  },
  components: {
    loading,
    xftzCells,
    xftzCell
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-popup
  .wv-popup
    bottom 0
    background-color $color-background
    .popup-data-switch
      border-top 1px solid $border-color-navbar
      border-radius 0
      border-bottom 1px solid #e5e5e5
      .xftz-cell /deep/
        padding 5px 15px
        .xftz-cell__bd
          color $txt-color-two
        .xftz-cell__ft
          position relative
          color $txt-color-danger
    .popup-data-group
      padding 0 10px
      margin 10px 0
      .popup-flex
        display flex
        font-size 14px
        align-items center
        height 34px
        line-height 34px
        .popup-flex-item
          text-align left
          flex 1
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          .item-label
            color $color-text-l
</style>
