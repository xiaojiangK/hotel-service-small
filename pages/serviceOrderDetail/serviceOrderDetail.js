// pages/serviceOrderDetail/serviceOrderDetail.js
var app = getApp();
const config = require('../../config/index');
import { formatDateTime } from '../../utils/tool.js';
import { qrcode } from '../../utils/qrcode.js';
var timer = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0.,
    flag: 0,
    source: '',
    qrcode: '',
    orderInfo: {},
    isUse: false,
    query: ''
  },
  goPay() {
    app.goPay(this.data.id, this.data.flag);
  },
  goRefund() {
    wx.showModal({
      title: '提示',
      content: '确定取消此订单吗?',
      cancelText: '取消',
      confirmText: '确定',
      success: (e) => {
        if (e.confirm) {
          app.util.request({
            url: "entry/wxapp/Refund",
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
                    status: 7
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
                        url: "entry/wxapp/Verifygoods",
                        data: {
                          openid: d.openid,
                          uniacid: d.uniacid,
                          orderid: this.data.id
                        },
                        success:(res) => {
                          if (res.data.status == 200) {
                            this.setData({ isUse: true });
                          } else {
                            wx.showToast({
                              title: res.data.info,
                              icon: 'none'
                            });
                          }
                        }
                      });
                    }
                  }
                });
              },
              fail: () => {
                app.userLogin(e.detail);
              }
            });
          }
        }
      });
    }
  },
  //预览二维码
  preview() {
    wx.previewImage({
      urls: [this.data.qrcode]
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
        const data = res.data;
        const goods_price = Number.parseFloat(data.goods_info[0].price)
        this.setData({
          orderInfo: {
            ...data,
            goods: data.goods_info[0],
            finish_time: formatDateTime(data.finish_time * 1000),
            price: Number.isInteger(goods_price) ? Number.parseInt(goods_price) : goods_price.toFixed(2)
          } 
        });
        
        if (data.status == '2') {
          this.setData({ isUse: false });
        } else if (data.status == '4') {
          this.setData({ isUse: true });
        }

        // 生成二维码
        if (this.data.source == 'order' && data.status == '2' && this.data.flag == '3') {
          wx.showLoading({
            title: '加载中...',
          });
          //二维码
          qrcode.draw(this.data.id, 'qrcode', 230);
          wx.hideLoading();
          // app.util.request({
          //   url: "entry/wxapp/QrCode",
          //   data: {
          //     flag: this.data.flag,
          //     order_id: this.data.id
          //   },
          //   success:(res) => {
          //     this.setData({ qrcode: config.baseURL + res.data });
          //     wx.hideLoading();
          //   }
          // });

        }
        if (this.data.source == 'order' && data.status == '2') {
          // 监听订单状态
          timer = setInterval(() => {
            app.util.request({
              url: "entry/wxapp/OrderStatus",
              data: {
                id: this.data.id
              },
              success:(res) => {
                if (res.data.status == 200 && res.data.data.status == 4) {
                  clearInterval(timer);
                  wx.navigateTo({
                    url: '/pages/payComplete/payComplete?type=2'
                  });
                }
              }
            });
          }, 3000);
        }
      }
    });
  },
  onShow() {
    var opt = wx.getLaunchOptionsSync();
    this.setData({
      query: JSON.stringify(opt)
    });
    // 接受参数
    if (opt.query.order && opt.query.flag) {
      this.setData({
        id: opt.query.order,
        flag: opt.query.flag
      });
    }
    this.loadData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (op) {
    if (op.source == 'order') {
      this.setData({
        id: op.id,
        flag: op.flag,
        source: op.source
      });
    }
  },
  onHide() {
    clearInterval(timer);
  },
  onUnload() {
    clearInterval(timer);
  },
  onShareAppMessage: function () {
  }
})