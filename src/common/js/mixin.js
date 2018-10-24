import xftzCells from 'base/xftz-cells/xftz-cells'
import xftzCell from 'base/xftz-cell/xftz-cell'
import {getUserSession, getWeChatCode} from 'api/authorize'
import {STATUS_CODE} from 'api/config'
import {COOKIE_NAME} from './config'
import {Dialog, Toast} from 'we-vue'

export const formInput = {
  computed: {
    // 判断手机号码
    rightPhoneNumber: function () {
      return /^1\d{10}$/gi.test(this.userInfo['cust.phone'])
    }
  },
  methods: {
    /* 清空输入框内容 */
    clearInfo (info) {
      for (let key in info) {
        this.userInfo[key] = ''
      }
    },
    /**
     * ==== 更改手机号验证 ====
     * @param mobile 验证的手机号码
     * @return 验证结果
     * @throws 引入该方法的组建必须含有 this.userInfo.mobile
     * */
    setMobileCheck (mobile) {
      try {
        this.userInfo['cust.phone'] = mobile
      } catch (e) {
        throw new Error('The build that introduced the method must contain "this.userInfo.mobile"')
      }
      return this.rightPhoneNumber
    },
    /* 跳转页面 */
    _toBuildPath (path) {
      this.$router.push(path)
    }
  },
  components: {
    xftzCells,
    xftzCell
  }
}

/* 获取用户openId */
export const getUserOpenId = {
  mounted () {
    // 如果获取不到用户微信信息 或者 时间戳不是今天 则重新获取
    let thatDate = parseInt(new Date().toLocaleDateString().replace(/\//g, ''))
    let weChatInfo = this.$storage.getStorage(COOKIE_NAME.weChatInfo)
    try {
      if (!weChatInfo || this.$storage.getStorage(COOKIE_NAME.weChat).weChatS != thatDate) {
        // 检测是否在微信浏览器环境
        let ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          // 如果没有code, 获取微信用户 code
          getWeChatCode()
        } else {
          Toast.fail({
            duration: 1000,
            message: '请使用微信打开'
          })
        }
        return false
      }
    } catch (e) { console.log(e) }
    this.wxInfo = weChatInfo
  }
}

/* 数据列表展示 头部 + 数据 */
export const dataList = {
  data () {
    return {
      page: 1,
      isRequery: true,
      listData: []
    }
  },
  activated () {
    this._initReqArgs()
  },
  methods: {
    /**
     * ==== 上拉加载 ====
     * */
    pullUp () {
      if (!this.page) return
      this.page++
      // 上拉加载重新初始化
      this._getPositionsOrder()
    },
    /**
     * ==== 初始化分类列表请求参数 ====
     * 由于 activated 的原因 页面每次显示都不会初始化某些参数
     * 因此需要手动初始化
     * */
    _initReqArgs () {
      this.page = 1
      this.listData = []
      this.isRequery = true
    },
    /**
     * ==== 请求结果处理 ====
     * 处理请求的 ListData数据 用于适应 scroll
     * @param res 请求的返回结果
     * */
    _resultManage (res) {
      let that = this
      if (res.status == STATUS_CODE) {
        if (res.data.pagedata) {
          that.listData = [...that.listData, ...res.data.pagedata]
        } else {
          // 单次数据请求完成
          that.page = false
          // 通知数据列表没有数据
          that.isRequery = false
        }
      }
    }
  }
}

/* 常用方法 */
export const baseFun = {
  methods: {
    /**
     * ==== 添加class ====
     * @param obj dom对象
     * @param cls 要添加的class
     * @return 拼接后的结果
     * */
    addClass (obj, cls) {
      let objClass = obj.className
      let blank = (objClass != '') ? ' ' : ''
      let Added = objClass + blank + cls
      return Added
    },
    /**
     * ==== 获取用户账户信息 ====
     * @return 账户基本信息
     * */
    async getUserAccount () {
      let userInfo = this.$storage.getStorage(COOKIE_NAME.userInfo)
      if (!userInfo) {
        Dialog.confirm({
          title: '温馨提示',
          message: '您的登录已过期，请重新登录',
          skin: 'ios',
          showCancelButton: false
        }).then(() => {
          this.$router.push('/login')
        })
        return
      }
      // 从本地获取用户ID
      let data = {'cust.id': userInfo.customer.id}
      await getUserSession(data).then(res => {
        if (res.status == STATUS_CODE) {
          this.userAccount = res.data
          // 存储用户信息
          this.$storage.setStorage(COOKIE_NAME.userInfo, res.data)
          this.$store.commit('SET_USERINFO', res.data)
        }
      })
    }
  }
}
