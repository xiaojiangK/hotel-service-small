// pages/payComplete/payComplete.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:{
      msgTitle: '下单成功',
      msgContent: '酒店将尽快与您确认订单'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.completeType && options.completeType == 1){
      this.setData({
        msg: {
          msgTitle: '取消成功',
          msgContent: '支付金额j将原路退回'
        }
      })
    } else if (options.completeType && options.completeType == 2){
      this.setData({
        msg: {
          msgTitle: '早餐券已使用',
          msgContent: '祝您用餐愉快'
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})