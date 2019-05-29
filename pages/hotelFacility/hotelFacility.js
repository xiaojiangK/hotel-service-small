// pages/hotelFacility/hotelFacility.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  loadData() {
    // 酒店设施
    wx.getStorage({
      key: 'hotel',
      success: (res) => {
        app.util.request({
          url: "entry/wxapp/Volume",
          data: {
            seller_id: res.data.id
          },
          success:(res) => {
            const list = res.data.map(item => {
              return {
                ...item,
                goods_img: app.globalData.url + item.goods_img
              }
            });
            this.setData({ list });
          }
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadData();
  }
})