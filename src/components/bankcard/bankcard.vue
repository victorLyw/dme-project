<template>
  <div class="xftz-bankcard-page">
    <head-top headTitle="我的银行卡">
    </head-top>
    <scroll class="list" ref="list">
      <div class="xftz-cont">
        <div class="bankcard-cardbox" v-if="isBindCard">
          <xftz-cells v-if="userAccount">
            <xftz-cell>
              <div slot="hd">{{userAccount.bankcard.cardname}}</div><div slot="ft">{{userAccount.bankcard.realname.substring(0,1)}}**</div>
            </xftz-cell><xftz-cell>
              <div slot="hd">卡号</div><div slot="ft">{{userAccount.bankcard.realID.substring(0,6)}}***</div>
            </xftz-cell><xftz-cell>
              <div slot="bd"><div class="xftz-txt-danger" @click="isBindCard = false">修改</div></div>
            </xftz-cell>
          </xftz-cells>
        </div>
        <div class="bankcard-formgroup" v-else>
          <xftz-cells>
            <div class="take-notice">
              <p class="xftz-txt-warn">* 以下信息为必填信息</p>
              <p class="take-notice-tel">
                <a :href="serviceTelephone|_getServiceHref">绑定后务必拨打客服电话 <span>{{serviceTelephone}}</span> 进行确认</a>
              </p>
            </div><xftz-cell>
              <div slot="hd" class="cell-label">姓名</div>
              <div slot="bd"><input type="text" placeholder="请输入真实姓名" v-model="userForm['card.realname']" /></div>
            </xftz-cell><xftz-cell>
              <div slot="hd" class="cell-label">身份证号</div>
              <div slot="bd">
                <input type="text" v-model.lazy="userForm['card.realID']" v-on:blur="_idCodeValid(userForm['card.realID'])" placeholder="请输入身份证号" />
              </div>
            </xftz-cell><xftz-cell>
              <div slot="hd" class="cell-label">银行卡号</div>
              <div slot="bd">
                <input type="text" v-model.lazy="userForm['card.cardno']" v-on:blur="_bankCodeChange(userForm['card.cardno'])" placeholder="请输入银行卡号" />
              </div>
            </xftz-cell><xftz-cell>
              <div slot="hd" class="cell-label">开户银行</div>
              <div slot="bd"><input type="text" placeholder="请输入开户银行" v-model="userForm['card.cardname']" /></div>
            </xftz-cell><xftz-cell @click.native="addressPickerShow = true">
              <div slot="hd" class="cell-label">开户地</div>
              <div slot="bd"><div class="bankcard-address">{{address | pickerValueFilter}}</div></div>
            </xftz-cell><xftz-cell>
              <div slot="hd" class="cell-label">开户支行</div>
              <div slot="bd"><input type="text" placeholder="请输入开户支行" v-model="joinForm['card.bankBranch']" /></div>
            </xftz-cell><xftz-cell>
              <div slot="hd" class="cell-label">验证码</div>
              <div slot="bd">
                <input type="number" placeholder="验证码" v-model="userForm['sms.valcode']" />
              </div>
              <span slot="ft" v-if="userAccount">
                <verify-code :calculagraph="60" :mobile="userAccount.customer.phone">
                </verify-code>
              </span>
            </xftz-cell><xftz-cell>
              <div slot="bd"><wv-button type="warn" @click="_bindBankCard">提交</wv-button></div>
          </xftz-cell>
          </xftz-cells>
        </div>
      </div>
    </scroll>
    <!--  开户地选择 @！选择框不能放入 滚动视图内部 -->
    <wv-picker
      class="openaccount-address-select"
      :visible.sync="addressPickerShow"
      v-model="address"
      ref="addressPicker"
      :columns="addressColumns"
      :visible-item-count="5"
      @cancel="confirmAddress"
      @change="onAddressChange"
      @confirm="confirmAddress"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import scroll from 'base/scroll/scroll'
import headTop from 'base/header/head'
import xftzCells from 'base/xftz-cells/xftz-cells'
import xftzCell from 'base/xftz-cell/xftz-cell'
import verifyCode from 'components/verify-code/verify-code'
import {baseFun} from 'common/js/mixin'
import {accountsBankbind, changeBankCard} from 'api/account'
import {chinaAreaData} from 'api/china-area-data'
import {STATUS_CODE} from 'api/config'
import {Toast, Dialog} from 'we-vue'

/** 省份数据转换 */
const provincesAry = []
for (let proI in chinaAreaData.provinces) {
  provincesAry.push(chinaAreaData.provinces[proI].provinceName)
}
const provinces = Object.values(provincesAry)
// 获取某一省下的市
const getCities = (province) => {
  let provinceCode
  for (let i = 0; i < chinaAreaData.provinces.length; i++) {
    if (province === chinaAreaData.provinces[i].provinceName) {
      provinceCode = i
      break
    }
  }
  /** 数据格式转换 */
  let citysObj = chinaAreaData.provinces[provinceCode].citys
  let citysAry = []
  for (let key in citysObj) {
    citysAry.push(citysObj[key].citysName)
  }
  return typeof chinaAreaData.provinces[provinceCode] === 'object' ? Object.values(citysAry) : []
}
// 获取某一市下的区/县
/* eslint-disable no-unused-vars */
function getAreas (province, city) {
  let provinceCode, cityCode
  for (let i = 0; i < chinaAreaData.provinces.length; i++) {
    if (province === chinaAreaData.provinces[i].provinceName) {
      provinceCode = i
      break
    }
  }
  for (let i in chinaAreaData.provinces[provinceCode].citys) {
    if (city === chinaAreaData.provinces[provinceCode].citys[i].citysName) {
      cityCode = i
      break
    }
  }
  if (chinaAreaData.provinces[provinceCode].citys[cityCode].citysName) {
    return typeof chinaAreaData.provinces[provinceCode].citys === 'object' ? Object.values(chinaAreaData.provinces[provinceCode].citys) : []
  } else {
    // 只有两级的情况
    return []
  }
}

export default {
  name: 'bankcard',
  mixins: [baseFun],
  data () {
    return {
      isBindCard: false,
      userAccount: null,
      serviceTelephone: '4001683600',
      addressPickerShow: false,
      address: ['请选择开户地'], // 设置开户地默认值
      addressColumns: [ // 设置初始化值
        {
          values: provinces
        },
        {
          values: getCities('北京市')
        }
      ],
      joinForm: {
        'card.bankProvince': '', // 省份
        'card.bankCity': '', // 市区
        'card.bankBranch': '' // 支行
      },
      userForm: {
        'card.realname': '',
        'card.realID': '',
        'card.cardno': '',
        'card.cardname': '',
        'card.custid': '',
        'sms.valcode': ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  activated () {
    this.getUserAccount()
    if (this.userInfo) {
      if (this.userInfo.bankcard.id !== 0) {
        this.isBindCard = true
      } else {
        this.isBindCard = false
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.addressPicker.setValues(['北京市', '北京市'])
      let Header = document.getElementById('headTop').offsetHeight
      this.$refs.list.$el.style.top = `${Header}px`
    })
  },
  methods: {
    onAddressChange (picker, addressValues, slotIndex) {
      if (slotIndex === 0) {
        const cities = getCities(addressValues[0])
        picker.setColumnValues(1, cities)
        // picker.setColumnValues(2, getAreas(addressValues[0], cities[0].citysName))
      } else if (slotIndex === 1) {
        const cities = getCities(addressValues[0])
        picker.setColumnValues(1, cities)
        // picker.setColumnValues(2, getAreas(addressValues[0], addressValues[1].citysName))
      }
    },
    confirmAddress (picker) {
      // 获取的数组值 0 为省 1 为市
      let addressValus = picker.getValues()
      this.address = addressValus
      // 更新数据省
      this.joinForm['card.bankProvince'] = addressValus[0]
      // 更新数据市
      this.joinForm['card.bankCity'] = addressValus[1]
    },
    /* ==== 绑定银行卡 ==== */
    _bindBankCard () {
      let userForm = this.userForm
      let jionForm = this.joinForm
      if (!this.userAccount) {
        Toast.text({
          duration: 1000,
          message: '获取信息失败'
        })
        return
      }
      // 判断银行卡开户支行拼接字段
      let cardAddress = ''
      for (let key in jionForm) {
        if (!jionForm[key]) {
          if (key === 'card.bankProvince' || key === 'card.bankCity') {
            Toast.text({
              duration: 1000,
              message: '请选择开户地'
            })
          } else {
            Toast.text({
              duration: 1000,
              message: '请将信息填写完整'
            })
          }
          return
        } else {
          cardAddress += jionForm[key]
        }
      }
      // 是否为修改银行卡
      let isVariation = this.userAccount.bankcard
      // 绑定银行卡注入用户id
      userForm['card.custid'] = this.userAccount.customer.id
      // 注入开户地址 开户行字段
      userForm['card.depositbank'] = cardAddress
      for (let key in userForm) {
        if (!userForm[key]) {
          if (key === 'card.depositbank') {
            Toast.text({
              duration: 1000,
              message: '开户地址为空'
            })
          } else {
            Toast.text({
              duration: 1000,
              message: '请将信息填写完整'
            })
          }
          return
        }
      }
      if (isVariation.id !== 0) {
        // 客户修改绑定银行卡
        changeBankCard(userForm).then(res => {
          if (res.status == STATUS_CODE) {
            // 更新用户信息
            this.getUserAccount()
            // 清空输入框内容
            for (let key in userForm) {
              this.userForm[key] = ''
            }
            this.isBindCard = true
            // 成功修改银行卡
            Dialog.confirm({
              title: '温馨提示',
              message: '您已成功修改银行卡，立即拨打客服电话进行确认？',
              skin: 'ios',
              showCancelButton: false
            }).then(() => {
              // 点击确定拨打电话
              location.href = 'tel:' + this.serviceTelephone
            })
          }
        })
      } else {
        // 客户首次绑定银行卡
        accountsBankbind(userForm).then(res => {
          if (res.status == STATUS_CODE) {
            // 更新用户信息
            this.getUserAccount()
            // 清空输入框内容
            for (let key in userForm) {
              this.userForm[key] = ''
            }
            this.isBindCard = true
            // 成功添加银行卡
            Toast.success('绑定成功')
          }
        })
      }
    },
    /* ==== 银行卡校验 ==== */
    _bankCodeChange (val) {
      let value = val.trim()
      if (!value) { return }
      // 校验银行卡号
      if (value.length < 16 || value.length > 19) {
        Toast.text({
          duration: 1.5 * 1000,
          message: '请输入正确的银行卡'
        })
        this.userForm['card.cardno'] = ''
        return
      }
      let num = /^[\d\s]+$/ // 全数字
      if (!num.exec(value)) {
        Toast.text({
          duration: 1.5 * 1000,
          message: '银行卡号必须全为数字'
        })
        this.userForm['card.cardno'] = ''
        return
      }
      // 开头6位
      let strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
      if (strBin.indexOf(value.substring(0, 2)) == -1) {
        Toast.text({
          duration: 1.5 * 1000,
          message: '银行卡号不符合规范'
        })
        this.userForm['card.cardno'] = ''
      }
    },
    /* ==== 身份证校验 ==== */
    _idCodeValid (code) {
      // 身份证号合法性验证 支持15位和18位身份证号 支持地址编码、出生日期、校验位验证
      /* eslint-disable key-spacing */
      /* eslint-disable quotes */
      /* eslint-disable comma-spacing */
      let city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "}
      if (!code) { return }
      if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {
        Toast.text({
          duration: 1.5 * 1000,
          message: '身份证号格式错误'
        })
        this.userForm['card.realID'] = ''
      } else if (!city[code.substr(0, 2)]) {
        Toast.text({
          duration: 1.5 * 1000,
          message: '身份证号地址编码错误'
        })
        this.userForm['card.realID'] = ''
      } else {
        // 18位身份证需要验证最后一位校验位
        if (code.length == 18) {
          code = code.split('')
          // ∑(ai×Wi)(mod 11)
          // 加权因子
          let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
          // 校验位
          let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ]
          let sum = 0
          let ai = 0
          let wi = 0
          for (let i = 0; i < 17; i++) {
            ai = code[i]
            wi = factor[i]
            sum += ai * wi
          }
          if (parity[sum % 11] != code[17].toUpperCase()) {
            Toast.text({
              duration: 1.5 * 1000,
              message: '身份证号校验位错误'
            })
            this.userForm['card.realID'] = ''
          }
        }
      }
    }
  },
  filters: {
    /* ==== 初始化提示语 ==== */
    pickerValueFilter (val) {
      if (Array.isArray(val)) {
        return val.toString()
      } else {
        return '请选择'
      }
    },
    /* ==== 获取客服电话 ==== */
    _getServiceHref (telP) {
      return 'tel://' + telP
    }
  },
  components: {
    headTop,
    scroll,
    xftzCells,
    xftzCell,
    verifyCode
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.xftz-bankcard-page
  .list
    position fixed
    bottom 0
    width 100%
    background $color-background
  .xftz-cont
    padding 0 10px
    .bankcard-cardbox
      background linear-gradient(to bottom, rgba(42,46,68,.9), rgba(60,60,80,.9))
      border-radius 8px
    .bankcard-formgroup
      margin 10px 0
      .take-notice
        padding 5px 10px
        border-bottom 1px solid $border-color-list
        .take-notice-tel
          font-size 14px
          text-align left
      .xftz-cells /deep/
        .xftz-cell
          input
            width 100%
          .xftz-verify-code
            button
              margin-right 0
      .bankcard-address
        height $height-input
        line-height $height-input
        background-color $color-background-cells
    .xftz-cells /deep/
      .xftz-cell
        .xftz-cell_hd
          color $color-text-l
          .cell-label
            width 80px
        .xftz-cell__ft
          right 10px
          color $color-text-ll
  .openaccount-address-select /deep/
    .weui-picker
      .weui-picker__hd
        background-color $color-background-bar-one
        border-top 1px solid $border-color-list
  </style>
