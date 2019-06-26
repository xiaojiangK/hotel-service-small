// pages/orderList/orderList.js
var app = getApp();
import { formatDate } from '../../utils/tool.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    orderList: [],
    isOrder: false
  },
  onPullDownRefresh() {
    this.loadData();
  },
  loadData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.showNavigationBarLoading();
    wx.getStorage({
      key: 'userinfo',
      success: (res)=>{
        app.util.request({
          url: "entry/wxapp/MyOrder",
          data: {
            uniacid: res.data.uniacid,
            user_id: res.data.id,
            page: this.data.page
          },
          success:(res) => {
            const orderList = res.data.map(item => {
              // 大于下单时间半个小时，则取消订单
              if (item.status == 1) {
                if (Date.now() - item.create_time * 1000 > (60 * 30 * 1000)) {
                  item.status = 3;
                  app.util.request({
                    url: "entry/wxapp/CancelOrder",
                    data: {
                      flag: item.flag,
                      order_id: item.id
                    }
                  });
                }
              }
              let totalNum = 0;
              if (item.goods_info) {
                for (let i of item.goods_info) {
                  totalNum += Number.parseInt(i.number);
                }
              } else {
                totalNum = item.num;
              }
              return {
                ...item,
                totalNum,
                arrival_time: formatDate(item.arrival_time * 1000),
                departure_time: formatDate(item.departure_time * 1000)
              }
            });
            this.setData({ orderList });
            if(orderList.length == 0){
              this.setData({
                isOrder:true
              })
            }
          }
        });
      },
      complete: () => {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow (options) {
    this.loadData();
  },
  onShareAppMessage: function () {
  }
})