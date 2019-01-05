const baseUrl = 'http://61.149.7.37:7795' // 测试外网

const api = {
  login: baseUrl + '/customBusServer/sms/zhifubao/login?client=4', // 登录
  indexPage: baseUrl + '/customBusServer/home/index?client=4', // 首页数据
  rideData: baseUrl + '/customBusServer/order/rideDate?client=4', // 日期选择数据
  bookingDayTicket: baseUrl + '/customBusServer/order/bookingDayTicket?client=4', // 日预约订单
  bookingMonthTicket: baseUrl + '/customBusServer/order/bookingMonthTicket?client=4', // 月预约订单
  orderPay: baseUrl + '/customBusServer/order/wakeUp/orderPay?client=4', // 支付接口
  couponAvailable: baseUrl + '/customBusServer/coupon/available/list?client=4', // 查询可用优惠券
  orderDetail: baseUrl + '/customBusServer/order/detail?client=4', // 订单详情
  orderCancel: baseUrl + '/customBusServer/order/cancel?client=4', // 取消订单
  orderList: baseUrl + '/customBusServer/order/list?client=4', // 我的订单列表数据
  guideList: baseUrl + '/customBusServer/guide/list?client=4', // 用户指南
  myCard: baseUrl + '/customBusServer/available/list',
  myCardAll: baseUrl + '/customBusServer/coupon/list?client=4',  //我的卡包列表
  myTrip: baseUrl + '/customBusServer/order/travel/list?client=4', //我的行程列表
  districtLine: baseUrl + '/customBusServer/home/district/search?client=4',  //区域线路展示
  searchLine: baseUrl + '/customBusServer/home/search?client=4',   //起点终点搜索线路
  lineInfo: baseUrl + '/customBusServer/line/schedule/info?client=4',   //线路详情
}

export default api
