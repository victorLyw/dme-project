import Storage from 'common/js/storage'
import router from '../router'
import store from '../store'
import axios from 'axios'
import {ERR_OK, STATUS_CODE, OUT_CODE} from 'api/config'
import {COOKIE_NAME, PRIVATEKEY} from 'common/js/config'
import {Dialog, Toast} from 'we-vue'
import {param} from './jsonp'
import md5 from 'js-md5'

/**
 * ==== 封装请求函数 ====
 * @param1 url 请求地址
 * @param2 data 请求参数
 * @param3 options 请求类型
 * @return 请求结果
 * @throws 此处data序列化再提交
 * */
export default function requery (url, data, options) {
  let datas = createSign(data)
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(datas)
  return new Promise((resolve, reject) => {
    axios({
      method: options.method,
      url: url,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: datas,
      transformRequest: [function (datas) {
        let ret = ''
        for (let it in datas) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(datas[it]) + '&'
        }
        return ret
      }]
    }).then(res => {
      // session 过期处理
      if (res.data.status == OUT_CODE) {
        Dialog.confirm({
          title: '提示',
          message: '您的登录已过期，请重新登录',
          skin: 'ios',
          showCancelButton: false
        }).then(() => {
          // 更改用户信息
          store.commit('SET_USERINFO', null)
          // 清除用户注册信息
          Storage.removeStorage(COOKIE_NAME.weChatInfo)
          router.push('/login')
        }).catch((e) => {
          // 更改用户信息
          store.commit('SET_USERINFO', null)
          router.push('/login')
        })
      } else {
        // 特殊处理 获取openid Api && 获取充值订单APi
        if (res.data.msg == ERR_OK || res.data.status == STATUS_CODE || res.data.scope) {
          resolve(res.data)
        } else if (res.data.status > STATUS_CODE) {
          Toast.fail({
            duration: 1.5 * 1000,
            message: '提示：' + errorMsg(res.data.msg)
          })
          resolve(res.data)
        } else {
          reject(res.statusText)
        }
      }
    })
  }).catch(e => {
    // 打印一下错误
    console.log(e)
  })
}

/**
 * ==== 生成sign ====
 * 所有对服务器请求需验签 sign的生成方式为所有请求的参数以及约定的
 * privatekey以字典序组合成字串(sign本身不参加验签)后md5并以小写输出
 *
 * @param data 请求参数
 * @return 验签后的数据
 * */
function createSign (data) {
  let objData = data
  let str = ''
  objData.privatekey = PRIVATEKEY
  // 字典排序
  let sdic = Object.keys(objData).sort()
  for (let key in sdic) {
    str += sdic[key] + '=' + objData[sdic[key]] + '&'
  }
  // 删除最后一个 & 符号
  str = str.substring(0, str.length - 1)
  data.sign = md5(str).toLowerCase()
  // 删除 privatekey
  delete data.privatekey
  return data
}

/**
 * ==== 后台错误提示信息 ====
 * @param msg 错误提示信息
 * @return 提取后的信息
 */
/* eslint-disable no-unused-vars */
function errorMsg (msg) {
  /*
  // 转换提示文字
  let stringErr = JSON.stringify(msg)
  let reg = /[\u4e00-\u9fa5]|[0-9]|.|,/g
  let sErr = stringErr.match(reg)
  stringErr = sErr.join('')
  return stringErr
  */
  return msg
}

/**
 else if (res.data.status > STATUS_CODE) {
        for (let k = 0; k < REQUEST_CODE_WALK.length; k++) {
          if (res.data.status == REQUEST_CODE_WALK[k]) {
            resolve(res.data)
          } else {
            for (let i = 0; i < REQUEST_CODE_COF.length; i++) {
              if (REQUEST_CODE_COF[i].code === res.data.status) {
                Toast.fail({
                  duration: 1.5 * 1000,
                  message: '提示：' + REQUEST_CODE_COF[i].msg
                })
                return
              } else {
                Toast.fail({
                  duration: 1.5 * 1000,
                  message: '提示：' + errorMsg(res.data.msg)
                })
              }
            }
          }
        }
      }
 * */
