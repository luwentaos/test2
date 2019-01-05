import api from '/utils/api.js'

/** 用户登录（每次打开小程序）
 * @app 小程序app实例，在app中自己调用请使用this
 */
export async function login (app) {
  return await new Promise ((resolve, reject) => {
    let userInfo = my.getStorageSync({ // 获取用户缓存
      key: 'userInfo',
    });
    if (userInfo.data && userInfo.data.token && userInfo.data.custId && userInfo.data.telephone) { // 有缓存，直接用缓存数据
      console.log('已有缓存：')
      app.globalData.custId = userInfo.data.custId
      app.globalData.telephone = userInfo.data.telephone
      phoneLogin(app).then((userInfoRes) => {
        resolve(userInfoRes)
      })
    } else { // 没有缓存，获取authCode登录小码后台
      console.log('没有缓存')
      getToken().then((res) => {
        app.globalData.token = res.token
        app.globalData.custId = res.custId
        app.globalData.telephone = res.telephone
        my.setStorageSync({
          key: 'userInfo',
          data: res
        });
        resolve(res)
      })
    }
  })
}

/** 使用缓存的手机号登录
 *@app  小程序app实例，在app中自己调用请使用this
 */
export async function phoneLogin (app) {
  return await new Promise((resolve, reject) => {
    let data = {
      telephone:app.globalData.telephone,
      channelId:'12345678'
    }
    data = JSON.stringify(data)
    my.httpRequest({ // 通过手机号获取用户token
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      url: api.login,
      data: data,
      success: (loginRes) => { // 请求成功，获取用户token
        let userInfo = loginRes.data.body[0]
        app.globalData.token = userInfo.token
        app.globalData.custId = userInfo.custId
        app.globalData.telephone = userInfo.telephone
        my.setStorageSync({
          key: 'userInfo',
          data: userInfo
        });
        resolve(userInfo)
      },
      fail: (err) => {
        console.log(err)
          my.showToast({
          type: 'fail',
          content: '网络异常',
          duration: 3000
        });
        reject(err)
      },
    });
  })
}

/** 获取用户token
 */
export async function getToken () {
  return await new Promise((resolve, reject) => {
    my.getAuthCode({
      scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
      success: (res) => {
        console.log(res)
        let data = {
          authCode:res.authCode,
          channelId:'12345678'
        }
        data = JSON.stringify(data)
        if (res.authCode) { // 认证成功,获取到用户auth_code
          my.httpRequest({ // 通过auth_code获取用户token
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            url: api.login,
            data: data,
            success: (loginRes) => { // 请求成功，获取用户token
              let userInfo = loginRes.data.body[0]
              resolve(userInfo)
            },
            fail: (err) => {
              console.log(err)
               my.showToast({
                type: 'fail',
                content: '网络异常',
                duration: 3000
              });
              reject(err)
            },
          });
        }
      },
    });
  })
}

/** 通用post请求
 * @data post参数,已用JSON.stringify()方法处理过的参数
 * @url 请求地址
 */
export function ajaxPost (data, url) {
  return new Promise((resolve, reject) => {
    my.httpRequest({ // 通过auth_code获取用户token
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      url: url,
      data: data,
      success: (res) => { // 请求成功，获取用户token
        // console.log('通用请求结果：')
        // console.log(res)
        if (res.data.resultCode == '00000' || res.data.resultCode == '30066') { // 请求成功，正常获取数据
          resolve(res)
        } else if (res.data.resultCode == '30083') { // 订单重复支付
          my.alert({
            title: '订单重复支付！' 
          });
          return
        } else if (res.data.resultCode == '30080') { // 线路暂未开通
          my.alert({
            title: '线路暂未开通！' 
          });
          return
        } else {
          my.alert({
            title: '系统异常！' 
          });
          return
        }
      },
      fail: (err) => {
        console.log(err)
          my.showToast({
          type: 'fail',
          content: '网络异常',
          duration: 3000
        });
        reject(err)
      },
    });
  })
}

/** 通用post请求
 * @app 小程序app实例，在app中自己调用请使用this
 */
export function reLogin (app) {
  phoneLogin(app).then(() => {
    my.alert({
      title: '登录信息异常，请重试！'
    })
  })
}