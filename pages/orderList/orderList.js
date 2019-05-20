// pages/orderList/orderList.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    orderList: []
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
            this.setData({
              orderList: res.data
            });
            wx.hideLoading();
            wx.hideNavigationBarLoading();
          }
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.loadData();
  }
})