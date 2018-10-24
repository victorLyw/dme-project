<template>
  <div class="xftz-search-page">
    <div class="search-box-wrapper">
      <search-box @clear="clearInput">
      </search-box>
    </div>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'

export default {
  name: 'search',
  methods: {
    /* ==== 清空输入框 ==== */
    clearInput () {
      this.$router.go(-1)
    }
  },
  components: {
    SearchBox
  }
}
</script>

<style scoped lang="stylus">
.xftz-search-page
  .search-box-wrapper
    padding 6px 10px
</style>
