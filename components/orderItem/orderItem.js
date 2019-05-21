// components/orderItem/orderItem.js
var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(newVal, oldVal) {
        this.setData({ data: newVal });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    c3: '',
    data: {}
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goDetail() {
      const flag = this.data.data.flag;
      if (flag == '0') {
        wx.navigateTo({
          url: `/pages/hotelOrderDetail/hotelOrderDetail?id=${this.data.data.id}&flag=${flag}`
        });
      } else if (flag == '1') {
        wx.navigateTo({
          url: `/pages/marketOrder/marketOrder?id=${this.data.data.id}&flag=${flag}`
        });
      } else {
        wx.navigateTo({
          url: `/pages/serviceOrderDetail/serviceOrderDetail?id=${this.data.data.id}&flag=${flag}`
        });
      }
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
                flag: this.data.data.flag,
                order_id: this.data.data.id
              },
              success:(res) => {
                if (res.data == 1) {
                  wx.showToast({
                    title: '取消成功',
                    icon: 'none'
                  });
                  const data = this.data.data;
                  this.setData({
                    data: {
                      ...data,
                      status: 3
                    }
                  });
                  wx.navigateTo({
                    url: `/pages/payComplete/payComplete?type=1`
                  });
                }
              }
            });
          }
        }
      });
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
              flag: this.data.data.flag,
              openid: res.data.openid,
              order_id: this.data.data.id
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
                    url: `/pages/payComplete/payComplete`
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
    goReserve() {
      wx.switchTab({
        url: '/pages/booking/booking'
      });
    }
  }
})
