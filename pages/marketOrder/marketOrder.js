// pages/marketOrder/marketOrder.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {}
  },
  loadData(op) {
    app.util.request({
      url: "entry/wxapp/orderdetails",
      data: {
        flag: op.flag,
        order_id: op.id
      },
      success:(res) => {
        this.setData({ orderInfo: res.data });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(op) {
    this.loadData(op);
  }
})