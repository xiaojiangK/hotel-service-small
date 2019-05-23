// components/orderItem/orderItem.js
import { countDown } from '../../utils/tool.js'
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
  pageLifetimes: {
    hide() {
      clearInterval(this.timer);
    },
    show() {
      this.startCountDown();
    }
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      this.startCountDown()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    data: {},
    time: '',
    timer: null
  },
  /**
   * 组件的方法列表
   */
  methods: {
    startCountDown(){
      this.timer = setInterval(() => {
        countDown(this.data.data.create_time, this);
      }, 1000);
    },  
    goDetail() {
      const data = this.data.data;
      const flag = data.flag;
      const id = data.id;
      if (flag == '0') {
        wx.navigateTo({
          url: `/pages/hotelOrderDetail/hotelOrderDetail?id=${id}&flag=${flag}`
        });
      } else if (flag == '1') {
        wx.navigateTo({
          url: `/pages/marketOrder/marketOrder?id=${id}&flag=${flag}`
        });
      } else {
        wx.navigateTo({
          url: `/pages/serviceOrderDetail/serviceOrderDetail?id=${id}&flag=${flag}&source=order`
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
            const data = this.data.data;
            app.util.request({
              url: "entry/wxapp/CancelOrder",
              data: {
                flag: data.flag,
                order_id: data.id
              },
              success:(res) => {
                if (res.data == 1) {
                  wx.showToast({
                    title: '取消成功',
                    icon: 'none'
                  });
                  this.setData({
                    data: {
                      ...data,
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
    goPay() {
      app.goPay(this.data.data.id, this.data.data.flag);
    },
    goReserve() {
      const flag = this.data.data.flag;
      if (flag == '0') {
        wx.switchTab({
          url: '/pages/booking/booking'
        });
      } else if (flag == '1') {
        wx.navigateTo({
          url: '/pages/supermarket/supermarket'
        });
      } else if (flag == '2') {
        wx.navigateTo({
          url: '/pages/hotelFacility/hotelFacility'
        });
      } else if (flag == '3') {
        wx.navigateTo({
          url: '/pages/morningVolume/morningVolume'
        });
      }
    }
  }
})
