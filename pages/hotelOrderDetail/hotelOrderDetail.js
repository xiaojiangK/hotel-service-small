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
    detail: {},
    roomNum: [],
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (op) {
    this.setData({ id: op.id });
    this.loadData();
  },
  loadData() {
    // 倒计时
    this.c3 = new $wuxCountDown({
      date: +(new Date) + 10000,
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
    app.util.request({
      url: "entry/wxapp/orderdetails",
      data: {
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
          totalPrice += Number.parseInt(detail.price);
        }
        for (let i = 0; i < detail.num; i++) {
          roomNum.push(i);
        }
        this.setData({
          roomNum,
          totalPrice: totalPrice * Number.parseInt(detail.num)
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
      success: () => {
        app.util.request({
          url: "entry/wxapp/CancelOrder",
          data: {
            order_id: this.data.id
          },
          success:(res) => {
            if (res.data == 1) {
              wx.showToast({
                title: '取消成功',
                icon: 'none'
              });
            }
          }
        });
      }
    });
  },
  goPay() {
    app.util.request({
      url: "entry/wxapp/pay",
      data: {
        order_id: this.data.id
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
        console.log(res.data);
      }
    });
  },
  goReserve() {}
})