// pages/serviceOrderDetail/serviceOrderDetail.js
var app = getApp();
import { formatDateTime } from '../../utils/tool.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0.,
    flag: 0,
    source: '',
    orderInfo: []
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
  goUse(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.getSetting({
        success:(res) => {
          if (res.authSetting["scope.userInfo"]){
            wx.getStorage({
              key: 'userinfo',
              success: (res) => {
                const d = res.data;
                wx.showModal({
                  title: '提示',
                  content: '确认使用后，该券将失效',
                  cancelText: '取消',
                  confirmText: '确定',
                  success: (e) => {
                    if (e.confirm) {
                      app.util.request({
                        url: "entry/wxapp/usedetails",
                        data: {
                          openid: d.openid
                        },
                        success:(res) => {
                          wx.navigateTo({
                            url: '/pages/payComplete/payComplete?type=2'
                          });
                        }
                      });
                    }
                  }
                });
              }
            });
          } else {
            app.userLogin();
          }
        }
      });
    }
  },
  loadData() {
    app.util.request({
      url: "entry/wxapp/orderdetails",
      data: {
        flag: this.data.flag,
        order_id: this.data.id
      },
      success:(res) => {
        const data = res.data;
        const g = data.goods[0];
        this.setData({
          orderInfo: {
            ...data,
            finish_time: formatDateTime(data.finish_time * 1000),
            goods: [{
              name: g.goods_name,
              img: app.globalData.url + g.goods_img
            }]
          } 
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (op) {
    this.data.id = op.id;
    this.data.flag = op.flag;
    this.setData({ source: op.source });
    this.loadData();
  }
})