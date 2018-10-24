// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
// @warn router引入一定要注意引入名称必须为小写 router
import router from './router'
import fastclick from 'fastclick'
import store from './store'
import Storage from 'common/js/storage'
import WeVue from 'we-vue'

import { iterceptRouter } from 'common/js/router-filter'

// 引入样式框架
import 'we-vue/lib/style.css'

import 'common/stylus/icon.css'
import 'common/stylus/index.styl'

Vue.config.productionTip = false

// 手机端点击300ms延迟解决
fastclick.attach(document.body)

// 注册全局 storage
Vue.prototype.$storage = Storage
Vue.use(WeVue)

// 开启路由拦截
iterceptRouter()

/* eslint-disable no-new */
new Vue({
  router,
  store
}).$mount('#app')
