import Vue from 'vue'
import App from '../App'
import Router from 'vue-router'
Vue.use(Router)
/** 引入页面 **/
const Login = (resolve) => {
  import('components/login/login').then((module) => {
    resolve(module)
  })
}

const Forget = (resolve) => {
  import('components/forget/forget').then((module) => {
    resolve(module)
  })
}

const Register = (resolve) => {
  import('components/register/register').then((module) => {
    resolve(module)
  })
}

/** 微信鉴权页 **/
const Author = (resolve) => {
  import('components/author/author').then((module) => {
    resolve(module)
  })
}

const Optional = (resolve) => {
  import('components/optional/optional').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module)
  })
}

const optionalDetail = (resolve) => {
  import('components/optional-detail/optional-detail').then((module) => {
    resolve(module)
  })
}

const Order = (resolve) => {
  import('components/order/order').then((module) => {
    resolve(module)
  })
}

const myInfo = (resolve) => {
  import('components/myinfo/myinfo').then((module) => {
    resolve(module)
  })
}

const Recharge = (resolve) => {
  import('components/recharge/recharge').then((module) => {
    resolve(module)
  })
}

const Cash = (resolve) => {
  import('components/cash/cash').then((module) => {
    resolve(module)
  })
}

const Account = (resolve) => {
  import('components/account/account').then((module) => {
    resolve(module)
  })
}

const Bankcard = (resolve) => {
  import('components/bankcard/bankcard').then((module) => {
    resolve(module)
  })
}

const Settings = (resolve) => {
  import('components/settings/settings').then((module) => {
    resolve(module)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      name: App,
      component: App,
      children: [
        // 地址为空跳转页面
        {
          path: '',
          redirect: '/optional'
        },
        // 商品列表页
        {
          path: '/optional',
          component: Optional,
          children: [
            {
              path: ':id',
              component: optionalDetail
            }
          ]
        },
        // 搜索
        {
          path: '/search',
          component: Search
        },
        // 订单
        {
          path: '/order',
          component: Order
        },
        // 我的
        {
          path: '/myinfo',
          component: myInfo
        },
        // 登录
        {
          path: '/login',
          component: Login,
          meta: {
            requiresAuth: true
          }
        },
        // 注册
        {
          path: '/register',
          component: Register,
          meta: {
            requiresAuth: true
          }
        },
        // 忘记密码
        {
          path: '/forget',
          component: Forget,
          meta: {
            requiresAuth: true
          }
        },
        // 微信鉴权页
        {
          path: '/author',
          component: Author,
          meta: {
            wxAuthor: true
          }
        },
        // 充值
        {
          path: '/recharge',
          component: Recharge
        },
        // 提现
        {
          path: '/cash',
          component: Cash
        },
        // 我的账户
        {
          path: '/account',
          component: Account
        },
        // 我的银行卡
        {
          path: '/bankcard',
          component: Bankcard
        },
        // 设置
        {
          path: '/settings',
          component: Settings
        }
      ]
    }
  ]
})
