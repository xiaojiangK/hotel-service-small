// pages/serviceOrderDetail/serviceOrderDetail.js
var app = getApp();
import { formatDateTime } from '../../utils/tool.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    source: '',
    orderInfo: []
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
  loadData(op) {
    this.setData({
      source: op.source
    });
    app.util.request({
      url: "entry/wxapp/orderdetails",
      data: {
        flag: op.flag,
        order_id: op.id
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
    this.loadData(op);
  }
})