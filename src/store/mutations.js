import * as types from './mutation-types'

const mutations = {
  [types.SET_USERINFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  [types.SET_USERACCOUNT] (state, userAccount) {
    state.userAccount = userAccount
  },
  [types.SET_OPTIONAL_DETAIL] (state, optionalDetail) {
    state.optionalDetail = optionalDetail
  }
}

export default mutations
