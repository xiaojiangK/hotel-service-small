// pages/supermarket/supermarket.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    selected: [],
    totalPrice: 0,
    totalCount: 0
  },
  loadData() {
    // 酒店超市
    app.util.request({
      url: "entry/wxapp/Goods",
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
  },
  getEmitData(e){
    let { totalPrice, totalCount } = e.detail
    this.setData({
      totalPrice,
      totalCount
    })
  },
  selected(){
    wx.navigateTo({
      url: '/pages/marketPay/marketPay',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.loadData();
  }
})