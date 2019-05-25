// pages/serviceOrderDetail/serviceOrderDetail.js
var app = getApp();
const config = require('../../config/index');
import { formatDateTime } from '../../utils/tool.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0.,
    flag: 0,
    source: '',
    qrcode: '',
    orderInfo: [],
    sceneTest: '',
    scene: ''
  },
  goPay() {
    app.goPay(this.data.id, this.data.flag);
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
                            wx.navigateTo({
                              url: '/pages/payComplete/payComplete?type=2'
                            });
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
                app.userLogin();
              }
            });
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
        this.setData({
          orderInfo: {
            ...data,
            goods: data.goods_info[0],
            finish_time: formatDateTime(data.finish_time * 1000),
          } 
        });
      }
    });
    // 生成二维码
    app.util.request({
      url: "entry/wxapp/QrCode",
      data: {
        flag: this.data.flag,
        order_id: this.data.id
      },
      success:(res) => {
        this.setData({ qrcode: config.baseURL + res.data });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (op) {

    // TEST
    this.setData({
      scene: app.globalData.scene,
      sceneTest: app.globalData.sceneTest
    });

    this.data.id = op.id;
    this.data.flag = op.flag;
    this.setData({
      source: op.source
    });
      
    // if (app.globalData.scene) {
    //   const scene = app.globalData.scene;
    //   this.data.id = scene[0];
    //   this.data.flag = scene[1];
    // } else {
    //   this.data.id = op.id;
    //   this.data.flag = op.flag;
    //   this.setData({
    //     source: op.source
    //   });
    // }
    this.loadData();
  }
})