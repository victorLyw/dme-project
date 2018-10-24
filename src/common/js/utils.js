/**
 * 获取url参数
 * */
export function getQueryString (name) {
  let result = window.location.search.match(new RegExp('[\\?\\&]' + name + '=([^\\&]+)', 'i'))
  if (result == null || result.length < 1) {
    return ''
  }
  return result[1]
}
