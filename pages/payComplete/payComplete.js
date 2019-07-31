// pages/payComplete/payComplete.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:{
      msgTitle: '下单成功',
      link: '/pages/orderList/orderList',
      msgContent: '酒店将尽快与您确认订单'
    },
    type:'',
    tel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (op) {
    let isIphoneX = app.globalData.isIphoneX;
    if (isIphoneX){
      this.setData({
        isIphoneX: isIphoneX
      });
    }
    wx.getStorage({
      key: 'hotel',
      success: (res) => {
        const data = res.data;
        this.setData({
          tel: data.tel,
          hotelName: data.name
        });
      }
    });
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
          msgTitle: '此券已使用',
          link: `/pages/orderList/orderList`,
          msgContent: '欢迎再次购买'
        }
      })
    } else if (op.type && op.type == '10001') {
      this.setData({
        type: op.type,
        msg: {
          msgTitle: '订单已提交',
          link: `/pages/orderList/orderList`,
          msgContent: '我们尽快与您确认订单，确认后有效，请以微信“服务通知结果为准”'
        }
      })
    } else {
      this.setData({
        msg: {
          msgTitle: '下单成功',
          link: `/pages/orderList/orderList`,
          msgContent: '使用时与酒店确认订单'
        }
      });
    }
  },
  callHotel(){
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    });
  },
  onShareAppMessage: function () {
  }
})