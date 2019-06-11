// pages/morningVolume/morningVolume.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  loadData() {
    // 酒店卷
    wx.getStorage({
      key: 'hotel',
      success: (res) => {
        app.util.request({
          url: "entry/wxapp/Service",
          data: {
            seller_id: res.data.id
          },
          success:(res) => {
            this.setData({ list:  res.data });
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