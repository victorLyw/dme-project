import * as types from './mutation-types'

export const optionalDetails = async function ({commit}, data) {
  commit(types.SET_OPTIONAL_DETAIL, data)
}
