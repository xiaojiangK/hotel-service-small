// components/orderItem/orderItem.js
import { resetTime } from '../../utils/common.js'
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

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() { 
      this.startCountDown()
    },
    moved() { },
    detached() { },
  },
  /**
   * 组件的初始数据
   */
  data: {
    remainTime:'',
    c3: '',
    data: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
    startCountDown(){
      resetTime(130,this)
    },
    goDetail() {
      wx.navigateTo({
        url: `/pages/hotelOrderDetail/hotelOrderDetail?id=${this.data.data.id}`
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
                }
              }
            });
          }
        }
      });
    },
    goPay() {
      app.util.request({
        url: "entry/wxapp/pay",
        data: {
          order_id: this.data.data.id
        },
        success:(res) => {
          wx.requestPayment({
            timeStamp: e.data.timeStamp,
            nonceStr: e.data.nonceStr,
            package: e.data.package,
            signType: e.data.signType,
            paySign: e.data.paySign,
            success:(e) => {
              wx.showToast({
                title: '恭喜您，支付成功!',
                icon: 'none'
              });
            },
            fail:(e) => {
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
    },
    goReserve() {}
  }
})
