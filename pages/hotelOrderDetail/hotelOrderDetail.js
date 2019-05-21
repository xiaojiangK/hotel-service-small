// pages/hotelOrderDetail/hotelOrderDetail.js
import { $wuxCountDown } from '../../dist/index';
import { formatMonth, formatDate, formatDateTime } from '../../utils/tool.js'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c3: '',
    id: 0,
    flag: 0,
    detail: {},
    roomNum: [],
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (op) {
    this.setData({
      id: op.id,
      flag: op.flag
    });
    this.loadData();
  },
  loadData() {
    app.util.request({
      url: "entry/wxapp/orderdetails",
      data: {
        flag: this.data.flag,
        order_id: this.data.id
      },
      success:(res) => {
        const d = res.data;
        const detail = {
          ...d,
          time: formatDateTime(d.time * 1000),
          inDate: formatDate(d.arrival_time * 1000),
          arrival_time: formatMonth(d.arrival_time * 1000),
          departure_time: formatMonth(d.departure_time * 1000)
        }
        this.setData({ detail });
        let totalPrice = 0;
        let roomNum = [];
        for (let i = 0; i < detail.days; i++) {
          totalPrice += Number.parseFloat(detail.price);
        }
        for (let i = 0; i < detail.days; i++) {
          roomNum.push(i);
        }
        this.setData({
          roomNum,
          totalPrice: totalPrice * Number.parseInt(detail.num)
        });
        
        // 倒计时
        this.c3 = new $wuxCountDown({
          date: +(d.time * 1000) + (60 * 30 * 1000),
          onEnd() {
            this.setData({
              c3: '重新获取'
            })
          },
          render(date) {
            const min = this.leadingZeros(date.min, 2) + ' 分 ';
            const sec = this.leadingZeros(date.sec, 2) + ' 秒 ';
            this.setData({
              c3: min + sec
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
                const d = this.data.detail;
                this.setData({
                  detail: {
                    ...d,
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
            flag: this.data.flag,
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
})