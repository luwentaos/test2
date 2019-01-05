/** 跳转至小程序通用webview页面
 * @url 页面地址
 */
export function toWebview (url) {
  let encodeUrl = encodeURIComponent(url)
  let pageUrl = '/pages/webView/webView?url=' + encodeUrl
  my.navigateTo({
    url: pageUrl
  });
}

/** 跳转至小程序页面
 * @url 页面地址（小程序路由页面）
 * params 页面参数
 */
export function toPage (url, params) {
  if (params) {
    let paramsStr = '?'
    for (let i in params) {
      paramsStr += i + '=' + params[i] + '&'
    }
    let newStr = paramsStr.substr(0, paramsStr.length - 1)
    // console.log(url + newStr)
    my.navigateTo({
      url: url + newStr
    });
  }
}