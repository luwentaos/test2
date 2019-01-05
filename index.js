// 获取应用实例
const app = getApp();

import api from '/utils/api.js'
import { login, phoneLogin, ajaxPost } from '/utils/ajax.js'
import { myticketData } from '/utils/aliData.js'
import { toWebview, toPage } from '/utils/link.js'

Page({
  data: {
    latitude: '',
    longitude: '',
    headerAdList: [], // 广告轮播图
    navList: [ //标签tab数据
      {
        titleName: '定制巴士',
        iconClass: 'dzbs-icon',
        activeIconClass: 'active-dzbs-icon'
      },
      {
        titleName: '网约小巴',
        iconClass: 'wyxb-icon',
        activeIconClass: 'active-wyxb-icon'
      },
      {
        titleName: '网约包车',
        iconClass: 'wybc-icon',
        activeIconClass: 'active-wybc-icon'
      },
      {
        titleName: '旅游巴士',
        iconClass: 'lybs-icon',
        activeIconClass: 'active-lybs-icon'
      }
    ],
    siteInfo:{
      startSiteInfo:'请选择上车起点',
      endSiteInfo: '请选择下车终点'
    },
    shwoInformation: true, // 是否显示运营信息
    informationData: '', // 运营信息显示内容
    activeIndex: 0, // 当前激活的标签
    recommendLocationList: [], // 推荐地点数据
    recommendLinesList: [], // 推荐线路数据
    adDialogsShow: false, // 是否显示全屏弹出广告
    loginStatus: false, // 登录状态
    adAlertList: {} // 全屏弹框广告数据
  },
  onLoad(query) {
    let _this = this
    // 获取当前位置
    my.getLocation({
      success(res) {
        console.log(res)
        console.log('当前位置：')
        if(app.globalData.startSite.latitude && app.globalData.endSite.latitude){
          console.log(1)
          _this.setData({
            siteInfo:{
              startSiteInfo: app.globalData.startSite.startSiteName,
              endSiteInfo: app.globalData.endSite.endSiteName
            },
            latitude: res.latitude.toString(),
            longitude: res.longitude.toString()
          })
        } else if (app.globalData.startSite.latitude){
          console.log(2)
          _this.setData({
            siteInfo: {
              startSiteInfo: app.globalData.startSite.startSiteName,
              endSiteInfo: '请选择下车终点'
            },
            latitude: res.latitude.toString(),
            longitude: res.longitude.toString()
          })
        } else if (app.globalData.endSite.latitude) {
          console.log(3)
          _this.setData({
            siteInfo: {
              startSiteInfo: '请选择上车起点',
              endSiteInfo: app.globalData.endSite.endSiteName
            },
            latitude: res.latitude.toString(),
            longitude: res.longitude.toString()
          })
        } else {
          console.log(4)
          _this.setData({
            latitude: res.latitude.toString(),
            longitude: res.longitude.toString()
          })
        }
        login(app).then(() => {
          _this.setData({
            loginStatus: true
          })
          _this.getPageData()
        })
      },
      fail(err) { 
        my.alert({ title: '定位失败' });
        login(app).then(() => {
          _this.setData({
            loginStatus: true
          })
          _this.getPageData()
        })
      },
    });
  },
  onShow () {
    
  },
  chooseSite(e){
    console.log(e.target.dataset)
    let url = "/pages/siteSearch/siteSearch"
    let params ={
      "type": e.target.dataset.siteType,
      "districtId":e.target.dataset.districtId
    }
    toPage(url,params)
  },
  navClickHandle (e) { // 标签切换
    let clickIndex = e.target.dataset.activeIndex
    if (clickIndex != this.data.avtiveIndex) {
      this.setData({
        activeIndex: clickIndex
      })
    }
  },
  getPageData () { // 获取页面数据
    let data = {
      channelId: '12345678',
      custId: app.globalData.custId,
      longitude: this.data.longitude,
      latitude: this.data.latitude
    }
    data = JSON.stringify(data)
    ajaxPost(data,api.indexPage).then((res) => {
     console.log(0)
      let allData = res.data.body[0]
      let headerAdList = allData.indexHeaderList // 轮播图广告
      let informationData = allData.indexBannerList[0] // 信息展示
      let recommendLocationList = allData.nearByDistrict // 推荐站点
      let recommendLinesList = myticketData(allData.frequentLine) // 推荐线路
      let adAlertList = allData.ndexAlert // 全屏弹出广告
      if (adAlertList) { // 如果全屏弹出广告有数据
        if ((adAlertList.needLogin == 1 && this.data.loginStatus) || adAlertList.needLogin == 0) {
          this.setData({
            adDialogsShow: true,
            adAlertList: adAlertList
          })
        }
      }
      this.setData({
        headerAdList: headerAdList,
        informationData: informationData,
        recommendLocationList: recommendLocationList,
        recommendLinesList: recommendLinesList
      })
    })
  },
  closeInformation () { // 关闭信息提示按钮
    this.setData({
      shwoInformation: false
    })
  },
  goWebView (e) { // 跳转至公共webview页面  
    let url = e.target.dataset.url 
    if (url) {
      toWebview(url)
    }
  },
  goLineDetail (data) { // 购票按钮
    let params = {
      scheduleId: data.scheduleId,
      upSiteId: data.upSiteId,
      downSiteId: data.downSiteId
    }
    let url = '/pages/dateChoose/dateChoose'
    toPage(url, params)
  },
  searchLine () { // 线路搜索
    console.log("查看APP")
    console.log(app)
    if (app.globalData.startSite.latitude || app.globalData.endSite.latitude){
      let url = '/pages/siteSearch/siteSearch'
      let params = {
        type: '4'
      }
      toPage(url,params)
    } else {
      console.log(2)
    }
  },
  goLineInfo(data) {
    let params= {
        scheduleId: data.scheduleId,
        upSiteId: data.upSiteId,
        downSiteId: data.downSiteId
    }
    let url = "/pages/lineInfo/lineInfo"
    toPage(url, params)
  },
  tabChangeHandle () { // 底部tab栏导航
    my.navigateTo({
      url: '/pages/userCenter/userCenter'
    });
  },
  closeAdDialogs () { // 关闭全屏弹框
    this.setData({
      adDialogsShow: false
    })
  }
});
