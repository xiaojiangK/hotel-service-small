// pages/marketOrder/marketOrder.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    flag: 0,
    orderInfo: {}
  },
  goPay() {
    wx.showLoading({
      title: '支付中...',
      mask: true
    });
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        app.util.request({
          url: "entry/wxapp/Pay",
          data: {
            flag: this.data.flag,
            openid: res.data.openid,
            order_id: this.data.id
          },
          success:(e) => {
            wx.requestPayment({
              timeStamp: e.data.timeStamp,
              nonceStr: e.data.nonceStr,
              package: e.data.package,
              signType: e.data.signType,
              paySign: e.data.paySign,
              success:() => {
                wx.showToast({
                  title: '恭喜您，支付成功!',
                  icon: 'none'
                });
                wx.navigateTo({
                  url: '/pages/payComplete/payComplete'
                });
              },
              fail:() => {
                wx.showToast({
                  title: "支付失败"
                });
              },
              complete:() => {
                wx.hideLoading();
              }
            });
          }
        });
      }
    });
  },
  cancelOrder() {
    wx.showModal({
      title: '提示',
      content: '确定取消此订单吗?',
      cancelText: '取消',
      confirmText: '确定',
      success: (e) => {
        if (e.confirm) {
          app.util.request({
            url: "entry/wxapp/CancelOrder",
            data: {
              flag: this.data.flag,
              order_id: this.data.id
            },
            success:(res) => {
              if (res.data == 1) {
                wx.showToast({
                  title: '取消成功',
                  icon: 'none'
                });
                const d = this.data.orderInfo;
                this.setData({
                  orderInfo: {
                    ...d,
                    status: 3
                  }
                });
                wx.navigateTo({
                  url: '/pages/payComplete/payComplete?type=1'
                });
              }
            }
          });
        }
      }
    });
  },
  loadData() {
    app.util.request({
      url: "entry/wxapp/orderdetails",
      data: {
        flag: this.data.flag,
        order_id: this.data.id
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
    this.data.id = op.id;
    this.data.flag = op.flag;
    this.loadData();
  }
})