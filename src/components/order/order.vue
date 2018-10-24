<template>
  <div class="xftz-order-page">
    <div id="orderTopHeight">
      <head-top headTitle="交易">
      </head-top>
      <navbar :itemList="categories" :itemKey="'name'" :theme="'red'" @selectChange="selectChange">
        <navbar :itemList="itemSub" :itemKey="'name'" :isSub="true" @selectChange="selectChangeSub">
        </navbar>
      </navbar>
    </div>
    <div class="xftz-cont">
      <data-list :topDoc="'orderTopHeight'" :isRequery="isRequery" :listTitle="listTitle" ref="dataListDoc" :listData="listData" @pullUp="pullUp">
        <ul class="list-content list-content-hook">
          <li class="list-item" :class="item.isSelect?'active': ''" v-for="item in listData" v-bind:key="item.id" @click="_selectProduct(item)">
            <div class="xftz-flex">
              <div class="xftz-flex__item"><div class="placeholder">{{item.products.productcode}}</div></div>
              <div class="xftz-flex__item"><div class="placeholder">{{item.products.name}}</div></div>
              <div class="xftz-flex__item"><div class="placeholder">{{item.products.exprice}}</div></div>
              <div class="xftz-flex__item"><div class="placeholder">{{item.order.cust}}</div></div>
              <div class="xftz-flex__item"><div class="placeholder">{{item.billstatus.enumvalue}}</div></div>
            </div>
          </li>
        </ul>
      </data-list>
      <popup :popupVisible="popupVisible" :popupData="popupData" :popupTitle="'数据详情'">
        <div slot="close" @click="popupVisible = false">关闭</div>
        <div slot="edit" class="list-detail-cell-ft" v-show="orderTypeCode === '0'" @click="_cancelOrder">撤销订单</div>
        <div slot="edit" class="list-detail-cell-ft" v-show="orderTypeCode === '1'" @click="_getPowerPosition">申请行权</div>
      </popup>
    </div>
    <tab-bar>
    </tab-bar>
  </div>
</template>

<script>
import headTop from 'base/header/head'
import navbar from 'base/navbar/navbar'
import tabBar from 'base/tabbar/tabbar'
import DataList from 'base/data-list/data-list'
import {dataList} from 'common/js/mixin'
import popup from 'base/popup/popup'
import {mapGetters} from 'vuex'
import {getPositionsOrder, getUnFinishOrder, getFinishOrder} from 'api/order'
import {Toast} from 'we-vue'

export default {
  name: 'order',
  mixins: [dataList],
  data () {
    return {
      page: 1,
      itemSub: [],
      orderTypeCode: '0',
      categories: [ // 导航栏目
        {
          name: '下单',
          isSelect: true,
          sub: [{
            code: '0',
            isSelect: true,
            name: '下单中'
          }, {
            code: '2',
            isSelect: false,
            name: '下单失败'
          }]
        }, {
          name: '持仓',
          isSelect: false,
          sub: [{
            code: '1',
            isSelect: true,
            name: '成功'
          }]
        }, {
          name: '结算',
          isSelect: false,
          sub: [{
            code: '3',
            isSelect: true,
            name: '结算'
          }]
        }
      ],
      listTitle: ['商品代码', '名称', '买价', '数量', '状态'],
      popupVisible: false,
      popupData: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  activated () {
    this._initArgs()
    this._getPositionsOrder()
  },
  methods: {
    /**
     * ==== 初始化参数 ====
     * */
    _initArgs () {
      for (let i = 0; i < this.categories.length; i++) {
        if (i === 0) {
          this.categories[i].isSelect = true
          for (let j = 0; j < this.categories[i].sub.length; j++) {
            if (j === 0) {
              this.categories[i].sub[j].isSelect = true
            } else {
              this.categories[i].sub[j].isSelect = false
            }
          }
        } else {
          this.categories[i].isSelect = false
        }
      }
      this.itemSub = this.categories[0].sub
      this.orderTypeCode = '0'
      // 更新滚动视图区域
      this.$refs.dataListDoc.computedScrollArea()
    },
    /* ==== 选项卡导航 ==== */
    selectChange (item) {
      if (item.sub) {
        if (item.sub.length > 1 && !item.sub[0].isSelect) {
          for (let i = 0; i < item.sub.length; i++) {
            if (i === 0) {
              item.sub[i].isSelect = true
            } else {
              item.sub[i].isSelect = false
            }
          }
        }
        this.itemSub = item.sub
        this.orderTypeCode = item.sub[0].code
        this._initReqArgs()
        this._getPositionsOrder()
      }
      // 更新滚动视图区域
      this.$refs.dataListDoc.computedScrollArea()
    },
    /* ==== 子选项卡 ==== */
    selectChangeSub (itemS) {
      this.orderTypeCode = itemS.code
      this._initReqArgs()
      this._getPositionsOrder()
      // 更新滚动视图区域
      this.$refs.dataListDoc.computedScrollArea()
    },
    /* ==== 获取订单列表 ==== */
    _getPositionsOrder () {
      let data = {
        'customer.id': this.userInfo.customer.id,
        'page.page_nums': 20,
        'page.page_current': this.page
      }
      // 0=>仓位查询; 1=>持仓; 2=>失败; 3=>结算
      if (this.orderTypeCode === '0') {
        getUnFinishOrder(data).then(res => {
          this._resultManage(res)
        })
        return
      }
      if (this.orderTypeCode === '1') {
        getFinishOrder(data).then(res => {
          this._resultManage(res)
        })
        return
      }
      if (this.orderTypeCode === '2') {
        Toast.text({
          duration: 1000,
          message: '下单失败：待更新...'
        })
        return
      }
      if (this.orderTypeCode === '3') {
        Toast.text({
          duration: 1000,
          message: '结算：待更新...'
        })
        return
      }
      if (this.orderTypeCode === '5') {
        getPositionsOrder(data).then(res => {
          this._resultManage(res)
        })
      }
    },
    /**
     * ==== 选择产品 ====
     * @param items 当前数据
     * **/
    _selectProduct (items) {
      this.listData.forEach(item => {
        this.$set(item, 'isSelect', (item.order.billcode === items.order.billcode))
      })
      this.dataDetailsFormat(items)
      // 显示数据弹框
      this.popupVisible = true
    },
    /* ==== 详情数据格式转换 ==== */
    dataDetailsFormat (data) {
      let thatData = data
      let dataFormat = [
        {
          subs: [
            {value: '', label: '商品代号', name: 'productcode'},
            {value: '', label: '商品名称', name: 'basename'}
          ]
        }, {
          subs: [
            {value: '', label: '持仓手数', name: 'nums'},
            {value: '', label: '购买数量', name: 'buynums'}
          ]
        }, {
          subs: [
            {value: '', label: '交易日期', name: 'offerdate'},
            {value: '', label: '购买价格', name: 'optionprice'}
          ]
        }, {
          subs: [
            {value: '', label: '权利金', name: 'exprice'},
            {value: '', label: '订单总金额', name: 'optionamount'}
          ]
        }, {
          subs: [
            {value: '', label: '周期', name: 'optionTime'},
            {value: '', label: '订单类型', name: ''}
          ]
        }, {
          subs: [
            {value: '', label: '标价类型', name: 'enumvalue'},
            {value: '', label: '状态', name: 'enumvalue'}
          ]
        }, {
          subs: [{value: '', label: '交易流水号', name: 'billcode'}]
        }, {
          subs: [{value: '', label: '创建日期', name: 'createdate'}]
        }]
      for (let i = 0; i < dataFormat.length; i++) {
        dataFormat[i].subs.forEach(item => {
          item.value = searchNameObj(item.name)
        })
      }
      /**
       * ==== 根据对象名返回对象值 ====
       * @param objName 要查找的对象名称
       * @return 要查找对象名称对应的值
       * */
      function searchNameObj (objName) {
        for (let keys in thatData) {
          if (keys !== 'isSelect') {
            for (let key in thatData[keys]) {
              if (objName === key) {
                return thatData[keys][key]
              }
            }
          }
        }
      }
      // 赋值到弹出框
      this.popupData = dataFormat
    },
    /* ==== 撤销订单 ==== */
    _cancelOrder () {
      let hours = new Date().getHours()
      if (!(hours < 14)) {
        Toast.text({
          duration: 1.5 * 1000,
          message: '当前时间不能撤销订单'
        })
        return
      }
      Toast.text({
        duration: 1000,
        message: '该功能暂未开放...'
      })
    },
    /* ==== 申请行权 ==== */
    _getPowerPosition () {
      Toast.text({
        duration: 1000,
        message: '该功能暂未开放...'
      })
    }
  },
  components: {
    headTop,
    navbar,
    tabBar,
    DataList,
    popup
  }
}
</script>

<style scoped>
</style>
