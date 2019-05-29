// pages/payComplete/payComplete.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:{
      msgTitle: '下单成功',
      link: '/pages/orderList/orderList',
      msgContent: '酒店将尽快与您确认订单'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (op) {
    if (op.type && op.type == '1'){
      this.setData({
        msg: {
          msgTitle: '取消成功',
          link: '/pages/orderList/orderList',
          msgContent: ''
        }
      })
    } else if (op.type && op.type == '2'){
      this.setData({
        msg: {
          msgTitle: '早餐券已使用',
          link: `/pages/orderList/orderList`,
          msgContent: '祝您用餐愉快'
        }
      })
    } else {
      this.setData({
        msg: {
          msgTitle: '下单成功',
          link: `/pages/orderList/orderList`,
          msgContent: '酒店将尽快与您确认订单'
        }
      });
    }
  }
})