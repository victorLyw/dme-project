<template>
  <div class="xftz-account-page">
    <div id="accountTopHead">
      <head-top headTitle="我的账户">
      </head-top>
      <div class="balance-detail-title">
        <xftz-cells><xftz-cell>
          <div slot="hd">
            <i class="xftz-txt-warn iconfont icon-jiaoyi"></i>
            <span>资金明细</span>
          </div>
        </xftz-cell></xftz-cells>
      </div>
    </div>
    <div class="xftz-cont">
      <div class="balance-detail">
        <data-list :topDoc="'accountTopHead'" :isRequery="isRequery" :isNavBar="false" :listTitle="listTitle" :listData="listData" @pullUp="pullUp">
          <ul class="list-content list-content-hook">
            <li class="list-item" v-for="item in listData" v-bind:key="item.id" @click="_selectGoods(item)">
              <div class="xftz-flex">
                <div class="xftz-flex__item"><div class="placeholder">{{item.createdate}}</div></div>
                <div class="xftz-flex__item"><div class="placeholder">{{item.amount}}</div></div>
                <div class="xftz-flex__item"><div class="placeholder">{{item.chargecode}}</div></div>
                <div class="xftz-flex__item"><div class="placeholder">{{item.status=='1'?'成功':'其它'}}</div></div>
              </div>
            </li>
          </ul>
        </data-list>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from 'base/header/head'
import xftzCells from 'base/xftz-cells/xftz-cells'
import xftzCell from 'base/xftz-cell/xftz-cell'
import DataList from 'base/data-list/data-list'
import {mapGetters} from 'vuex'
import {dataList} from 'common/js/mixin'
import {accountsRecords} from 'api/account'

export default {
  name: 'account',
  mixins: [dataList],
  data () {
    return {
      listTitle: ['时间', '金额', '单号', '操作'],
      listData: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  activated () {
    this.getAccountList()
  },
  methods: {
    /* ==== 上拉加载 ==== */
    pullUp () {
      if (!this.page) return
      this.page++
      // 上拉加载重新初始化
      this.getAccountList()
    },
    /* ==== 获取资金明细 ==== */
    getAccountList () {
      if (!this.userInfo) { return }
      let data = {
        'cust.id': this.userInfo.customer.id,
        'page.page_nums': 10,
        'page.page_current': this.page
      }
      accountsRecords(data).then(res => {
        this._resultManage(res)
      })
    }
  },
  components: {
    headTop,
    xftzCells,
    xftzCell,
    DataList
  }
}
</script>

<style scoped>

</style>
