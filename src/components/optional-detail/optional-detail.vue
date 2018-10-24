<template>
  <div class="xftz-optional-detail">
    <head-top :headTitle="headTitle">
    </head-top>
    <scroll class="cont-scroll" ref="list">
      <div class="xftz-cont">
        <xftz-cells class="user-balance"><xftz-cell>
          <span slot="hd">
            账户余额
            <span class="xftz-txt-danger" v-if="userAccount">￥{{userAccount.customer.balance}}</span>
          </span>
          <span slot="ft">
            <router-link tag="span" to="/recharge">
              充值 <i class="iconfont icon-youjiantou"></i>
            </router-link>
          </span>
        </xftz-cell></xftz-cells>
        <xftz-cells>
          <xftz-cell v-if="optionalDetail">
            <span slot="hd"> <i class="iconfont icon-dunpai"></i> 商品标的 </span>
            <span slot="ft"> {{optionalDetail.product.productcode}} </span>
          </xftz-cell><xftz-cell v-if="optionalDetail">
            <span slot="hd"> <i class="iconfont icon-jiaoyi"></i> 当前价格 </span>
            <span slot="ft">￥ {{optionalDetail.product.optionMoney}} </span>
          </xftz-cell><xftz-cell>
            <span slot="hd"> <i class="iconfont icon-msnui-more"></i> 期限选择 </span>
          </xftz-cell>
          <div class="term-select">
            <span class="term-select__item term-select__active" v-for="(item, index) in termSelect" :key="index">
              <span class="placeholder">{{item}}</span>
            </span>
          </div>
          <xftz-cell>
            <span slot="hd"> <i class="iconfont icon-iconshezhi"></i> 期限类型 </span>
            <span slot="ft">
              <span class="term-type-radio" :class="item.isSelect? item.buyType : ''"
                    v-for="(item, index) in termType"
                    :key="index"
                    @click="termTypeChange(item)">
                {{item.label}}
              </span>
            </span>
          </xftz-cell>
          <div class="term-type-details">
            <div class="term-select">
              <span class="term-select__item"></span>
              <span class="term-select__item">行权价格</span>
              <span class="term-select__item">权利金</span>
            </div>
            <div class="term-select term-type__item" :class="item.isSelect?'term-type__active': ''"
                 v-for="(item, index) in termTypeItem"
                 :key="index"
                 @click="termTypeItemChange(item, index)">
              <span class="term-select__item">
                <i class="iconfont icon-xuanze"></i>
              </span>
              <span class="term-select__item">{{item.exprice}}</span>
              <span class="term-select__item">{{item.optionMoney}}</span>
            </div>
          </div>
          <xftz-cell>
            <span slot="hd"> <i class="iconfont icon-msnui-more"></i> 购买数量 </span>
            <span slot="ft">
              <span class="quote-number_spinner">
                <wv-number-spinner :min="quoteNumberMin" :max="100000000000" v-model="quantity" @change="_quantityChange" input-width="3em">
                </wv-number-spinner>
              </span>
              <!--<span>{{quoteTypeDetails.quoteUnit[1]}}</span>-->
              <span>手</span>
            </span>
          </xftz-cell><xftz-cell>
            <span slot="hd"> <i class="iconfont icon-shangpin"></i> 到期日期 </span>
            <span slot="ft" v-if="productDetail.product"> {{productDetail.product.offerdate.split(' ')[0]}} </span>
          </xftz-cell><xftz-cell>
            <span slot="hd"> <i class="iconfont icon-jiaoyi"></i> 总权利金 </span>
            <span slot="ft">￥ {{premiumTotal}} </span>
          </xftz-cell>
        </xftz-cells>
        <div class="xftz-from-group">
          <p class="take-notice">最小手数：交易所规定的最小交易手数</p>
          <wv-button type="warn" :disabled="!isPlaceOrder" @click="_orderApplication">下单申请</wv-button>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import headTop from 'base/header/head'
import scroll from 'base/scroll/scroll'
import xftzCells from 'base/xftz-cells/xftz-cells'
import xftzCell from 'base/xftz-cell/xftz-cell'
import {mapGetters} from 'vuex'
import {getProductDetails, placeOrder} from 'api/product'
import {Toast} from 'we-vue'
import {STATUS_CODE} from 'api/config'
import {baseFun} from 'common/js/mixin'

export default {
  name: 'optional-detail',
  mixins: [baseFun],
  data () {
    return {
      userAccount: null,
      accountBalance: 0, // 账户余额
      isPlaceOrder: false, // 是否满足下单
      headTitle: '商品详情',
      productDetail: {}, // 商品详情
      termSelect: [], // 期限选择
      termType: [], // 期限类型
      termTypeItem: [], // 期限类型子数据
      termTypeItemI: 0, // 期限类型子选项下标
      quantity: 1, // 购买数量
      quoteNumberMin: 1, // 最小购买数量
      premiumTotal: 0 // 总权利金
    }
  },
  computed: {
    ...mapGetters([
      'optionalDetail',
      'userInfo'
    ])
  },
  mounted () {
    let Header = document.getElementById('headTop').offsetHeight
    this.$refs.list.$el.style.top = `${Header}px`
  },
  activated () {
    this.initData()
    this.getUserAccount()
    if (this.optionalDetail) {
      let ODP = this.optionalDetail.product
      this.headTitle = ODP.name + '(' + ODP.productcode + ')'
    }
    this._getProductDetails()
  },
  methods: {
    /* ==== 需要每次初始化的数据 ====  */
    initData () {
      this.termSelect = []
      this.termType = []
      this.termTypeItem = []
      this.termTypeItemI = 0
      if (this.userInfo) {
        if (this.userInfo.customer.balance > 0) {
          this.isPlaceOrder = true
        } else {
          this.isPlaceOrder = false
        }
      }
    },
    /* ==== 获取商品详情 ====  */
    _getProductDetails () {
      let productId = this.optionalDetail.product.id
      if (!productId) return
      let data = {
        'product.id': productId
      }
      getProductDetails(data).then(res => {
        if (res.status == STATUS_CODE) {
          this.productDetail = res.data
          // 期限选择
          this.termSelect.push(res.data.product.optionTime)
          this.dataFormatConversion(res.data)
        }
      })
    },
    /* ==== 数据格式转换 ====  */
    dataFormatConversion (data) {
      // 买涨 & 买跌
      const buyDirect = {buyUp: 1, buyDown: 2}
      // 定义日期 & 期限类型
      // const durationNames = {d: '天', m: '月', y: '年'}
      const quoteTypeName = {buyUp: '买涨', buyDown: '买跌', sellDown: '卖跌', sellUp: '卖涨'}
      // 期限类型 & 期限类型子数据
      let thatTermType = {}

      // 期限类型
      let buyUp = {}
      let buyDown = {}
      thatTermType.buyUp = getBuyTypeLabel(buyUp, 'buyUp', true)
      this.termType.push(thatTermType.buyUp)
      thatTermType.buyDown = getBuyTypeLabel(buyDown, 'buyDown', false)
      this.termType.push(thatTermType.buyDown)

      for (let key in thatTermType) {
        if (thatTermType[key].isSelect) {
          this.termTypeItem.push(thatTermType[key].val[0])
          break
        }
      }

      // 初始化期限类型子选项默认选项
      for (let i = 0; i < this.termTypeItem.length; i++) {
        if (i === 0) {
          this.termTypeItem[i].isSelect = true
          // 初始化最小手数
          this.quoteNumberMin = this.termTypeItem[i].translimit
          this.quantity = this.termTypeItem[i].translimit
        } else {
          this.termTypeItem[i].isSelect = false
        }
      }

      // 计算总价格
      this._amountTotal()

      // 生成期限类型格式
      function getBuyTypeLabel (buyType, strBuyType, Bole) {
        buyType.isSelect = Bole
        buyType.buyType = strBuyType
        buyType.val = new Array(data.product)
        for (let key in quoteTypeName) {
          if (key === strBuyType) {
            buyType.label = quoteTypeName[key]
          }
        }
        for (let dir in buyDirect) {
          if (dir === strBuyType) {
            buyType.buydirect = buyDirect[dir]
          }
        }
        return buyType
      }
    },
    /* ==== 期限类型变动 ====  */
    termTypeChange (items) {
      if (items.isSelect) return
      this.termType.forEach(item => {
        item.isSelect = (item.buyType === items.buyType)
        if (item.isSelect) {
          this.termTypeItem = []
          this.termTypeItem.push(item.val[0])
        }
      })
      // 计算价格
      this._amountTotal()
    },
    /* ==== 期限类型子选项变动 ====  */
    termTypeItemChange (items, index) {
      if (items.isSelect) return
      // 保存下标 放便计算当前选中的总价格
      this.termTypeItemI = parseInt(index)
      this.termTypeItem.forEach(item => {
        item.isSelect = (item.id === items.id)
        if (item.isSelect) {
          // 初始化最小手数
          this.quoteNumberMin = item.translimit
          this.quantity = item.translimit
        }
      })
      // 计算价格
      this._amountTotal()
    },
    /* ==== 下单申请 ====  */
    _orderApplication () {
      // 禁用下单按钮
      this.isPlaceOrder = false
      let quantity = this.quantity
      let quoteId = this.termTypeItem[this.termTypeItemI].id
      let userId = this.userAccount.customer.id
      let buyDirect = 1
      for (let i = 0; i < this.termType.length; i++) {
        if (this.termType[i].isSelect) {
          buyDirect = this.termType[i].buydirect
        }
      }
      if (!quoteId || !userId) { return }
      // 检查下单数量是否正确
      if (quantity < this.quoteNumberMin) {
        this.quantity = this.quoteNumberMin
      }
      let data = {
        'order.productid': quoteId, // 报价id
        'order.buynums': quantity, // 购买数量
        'order.cust': userId, // 用户id
        'order.buydirect': buyDirect // 买涨 || 买跌
      }
      placeOrder(data).then(res => {
        if (res.status == STATUS_CODE) {
          Toast.success('下单成功')
          // 启用下单按钮
          this.isPlaceOrder = true
          // 跳转到下单列表
          this.$router.push('/order')
        }
      })
    },
    /* ==== 购买数量 ====  */
    _quantityChange () {
      // 重新计算价格
      this._amountTotal()
    },
    /* ==== 计算总价 ====  */
    _amountTotal () {
      //  optionMoney * quantity(购买数量) * nums
      let optionMoney = this.termTypeItem[this.termTypeItemI].optionMoney
      let tradingUnit = this.productDetail.productBase.nums
      // 保留两位小数
      this.premiumTotal = Math.floor(optionMoney * this.quantity * tradingUnit * 100) / 100
      // 是否满足购买条件
      if (this.userAccount) {
        if (parseFloat(this.premiumTotal) > parseFloat(this.userAccount.customer.balance)) {
          this.isPlaceOrder = false
        } else {
          this.isPlaceOrder = true
        }
      }
    }
  },
  components: {
    headTop,
    scroll,
    xftzCells,
    xftzCell
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.xftz-optional-detail
  pos-fixed-screen()
  background-color $color-background
  z-index 600
  .cont-scroll
    position fixed
    bottom 0
    width 100%
    background $color-background
  .xftz-cont
    .user-balance
      margin-top 0
      border-radius 0
      background-color $color-background-h
      border 1px solid $border-color-navbar
    .xftz-cells /deep/
      .xftz-cell_hd
        color $color-text-l
      .xftz-cell__ft
        color $color-text
        right 10px
        .term-type-radio
          display inline-block
          height $height-nav-one
          line-height $height-nav-one
          min-width 80px
          border 1px solid $border-color-navbar
          text-align center
          margin-right 10px
          border-radius 8px
          background $color-background-fg
        .buyUp
          background-color $txt-color-danger
          color $color-text
        .buyDown
          background-color $txt-color-success
          color $color-text
    .term-select
      display flex
      flex-wrap wrap
      justify-content space-around
      padding-bottom 10px
      border-bottom 1px solid $border-color-list
      margin-bottom 10px
      .term-select__item
        display inline-block
        width 30%
        flex .1 1 auto
        margin-top 10px
        height $height-nav-one
        line-height $height-nav-one
        box-sizing border-box
        border 1px solid $border-color-list
        border-radius 8px
      .term-select__active
        background-color $txt-color-info
        color $color-text
    .term-type-details
      .term-type__item, .term-select
        margin-bottom 0
        padding-bottom 0
        .term-select__item
          border 0
          margin-top 0
      .term-type__active
        background-color $color-background-f
        .iconfont
          color $txt-color-select
    .xftz-from-group
      padding 0 10px
      margin 20px 0 30px 0
      .take-notice
        color $txt-color-two
        margin 6px 0 10px 0
    .wv-number-spinner /deep/
      float left
      margin-right 10px
      height 2em
      .spinner-btn
        margin 0
        &:after, &:before
          background-color $txt-color-warn
        &:disabled:after, &:disabled:before
          background-color $txt-color-two
      input
        height auto
</style>
