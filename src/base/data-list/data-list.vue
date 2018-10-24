<template>
  <section class="xftz-data-list">
    <div class="data-list-title" id="dataTitle">
      <div class="xftz-flex">
        <div class="xftz-flex__item" v-for="(item, index) in listTitle" :key="index">
          <div class="placeholder">{{item}}</div>
        </div>
      </div>
    </div>
    <div class="data-list-cont">
      <scroll :data="listData" :pullup="pullup" @scrollToEnd="loadUp" ref="scroll" class="list">
        <div>
          <slot></slot>
        </div>
        <div v-show="!listData.length && isRequery">
          <loading></loading>
        </div>
        <div class="prompt-txt" v-show="!listData.length && !isRequery">
          暂无数据...
        </div>
      </scroll>
    </div>
  </section>
</template>

<script>
import scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

export default {
  name: 'data-list',
  data () {
    return {
      pullup: true,
      hasMore: true
    }
  },
  props: {
    listTitle: {
      type: Array,
      default: null
    },
    listData: {
      type: Array,
      default: null
    },
    /**
     * @param topDoc 该组件到顶部之间的document元素
     * */
    topDoc: {
      type: String,
      default: ''
    },
    isNavBar: {
      type: Boolean,
      default: true
    },
    /* ==== 是否请求完成 ==== */
    isRequery: {
      type: Boolean,
      default: true
    }
  },
  activated () {
    this.computedScrollArea()
  },
  methods: {
    /* ==== 上拉加载 ==== */
    loadUp () {
      this.$emit('pullUp')
    },
    /* ==== 计算滚动视图的区域 ==== */
    computedScrollArea () {
      this.$nextTick(function () {
        let dataTitle = document.getElementById('dataTitle').offsetHeight
        let topHeight = document.getElementById(this.topDoc).offsetHeight
        this.minTransalteY = dataTitle + topHeight
        this.$refs.scroll.$el.style.top = `${this.minTransalteY}px`
        // 判断是否包含底部导航
        if (this.isNavBar) {
          let bottomHeight = document.getElementById('navBar').offsetHeight
          this.$refs.scroll.$el.style.bottom = `${bottomHeight}px`
        }
      })
    }
  },
  components: {
    scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-data-list
  .data-list-title
    background-color $color-background-bar-one
    border-top 1px solid $border-color-navbar
    position relative
    z-index 10
    .xftz-flex__item
      height $height-nav-one
      line-height $height-nav-one
  .data-list-cont /deep/
    .active
      background-color $txt-color-warn
    .xftz-flex
      border-bottom 1px solid $border-color-list
      .xftz-flex__item
        height $height-nav-one
        line-height $height-nav-one
        overflow hidden
        .placeholder
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
  .list
    position fixed
    bottom 0
    width 100%
    background $color-background
  .prompt-txt
    margin 10px 0
    color $txt-color-two
</style>
