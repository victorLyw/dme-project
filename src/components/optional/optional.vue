<template>
  <div class="xftz-optional-page">
    <div id="topHeight">
      <head-top headTitle="商品期权" :goBack="false" @editClick="$router.push('/search')" :edit="false">
        <span slot="edit" class="iconfont icon-search"></span>
      </head-top>
      <navbar :itemList="categoryList" :itemKey="'enumvalue'" @selectChange="selectChange">
      </navbar>
    </div>
    <div class="xftz-cont">
      <data-list :topDoc="'topHeight'" :isRequery="isRequery" :listTitle="listTitle" :listData="listData" @pullUp="pullUp">
        <ul class="list-content list-content-hook">
          <li class="list-item" v-for="item in listData" v-bind:key="item.id" @click="_selectGoods(item)">
            <div class="xftz-flex">
              <div class="xftz-flex__item"><div class="placeholder">{{item.product.productcode}}</div></div>
              <div class="xftz-flex__item"><div class="placeholder">{{item.product.name}}</div></div>
              <div class="xftz-flex__item">
                <div class="placeholder txt-down" v-if="item.product.optionMoney > item.product.optionMoneyRate">
                  {{item.product.optionMoney}}
                </div>
                <div class="placeholder txt-up" v-else>{{item.product.optionMoney}}</div>
              </div>
              <div class="xftz-flex__item"><div class="placeholder">{{item.product.translimit}}</div></div>
            </div>
          </li>
        </ul>
      </data-list>
    </div>
    <tab-bar></tab-bar>
    <!-- Details -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- End Details -->
  </div>
</template>

<script>
import headTop from 'base/header/head'
import tabBar from 'base/tabbar/tabbar'
import navbar from 'base/navbar/navbar'
import DataList from 'base/data-list/data-list'
import {dataList} from 'common/js/mixin'
import {getGoodsCategory, getCategoryList} from 'api/product'
import {STATUS_CODE} from 'api/config'
import {mapActions} from 'vuex'

export default {
  name: 'optional',
  mixins: [dataList],
  data () {
    return {
      listTitle: ['商品代码', '名称', '最新价', '最小手数'],
      categoryList: [{enumvalue: '商品分类'}],
      categoryItem: []
    }
  },
  activated () { // 每次页面显示都会执行
    this._getGoodsCategory()
  },
  methods: {
    /* ==== 上拉加载 ====  */
    pullUp () {
      if (!this.page) return
      this.page++
      // 上拉加载重新初始化
      this._getCategoryList()
    },
    /* ==== 选项卡导航 ====  */
    selectChange (item) {
      this.categoryItem = item
      this._initReqArgs()
      this._getCategoryList()
    },
    /* ==== 获取产品分类 ====  */
    async _getGoodsCategory () {
      getGoodsCategory().then(res => {
        if (res.status == STATUS_CODE) {
          for (let i = 0; i < res.data.length; i++) {
            if (i === 0) {
              res.data[i].isSelect = true
            } else {
              res.data[i].isSelect = false
            }
          }
          this.categoryList = res.data
          // 初始化选项
          this.categoryItem = res.data[0]
          this._getCategoryList()
        }
      })
    },
    /* ==== 获取分类列表 ====  */
    _getCategoryList () {
      let data = {
        'base.basetype': this.categoryItem.enumid,
        'page.page_nums': 20,
        'page.page_current': this.page
      }
      getCategoryList(data).then(res => {
        this._resultManage(res)
      })
    },
    /* ==== 选择商品 ====  */
    _selectGoods (goods) {
      this.$router.push({
        path: `/optional/${goods.product.productcode}`
      })
      this.optionalDetails(goods)
    },
    ...mapActions([
      'optionalDetails'
    ])
  },
  components: {
    tabBar,
    headTop,
    navbar,
    DataList
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-optional-page
  .xftz-navbar-page /deep/
    .xftz-navbar-item
      border 1px solid $border-color-list
  .txt-up
    color $txt-color-up
  .txt-down
    color $txt-color-down
</style>
