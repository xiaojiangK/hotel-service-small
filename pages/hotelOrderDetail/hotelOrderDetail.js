// pages/hotelOrderDetail/hotelOrderDetail.js
import { $wuxCountDown } from '../../dist/index';
import { formatMonth, formatDate, formatDateTime, formatTime } from '../../utils/tool.js'
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
          arrival_time: formatMonth(d.arrival_time * 1000),
          departure_time: formatMonth(d.departure_time * 1000)
        }
        // 订单明细
        app.util.request({
          url: "entry/wxapp/GetRoomCost",
          data: {
            room_id: d.room_id,
            end: formatDate(d.departure_time * 1000),
            start: formatDate(d.arrival_time * 1000)
          },
          success: (res) => {
            
            let totalPrice = 0;
            const roomCost = res.data.map(item => {
              totalPrice += Number.parseFloat(item.mprice);
              return item;
            });
            const num = detail.num;
            if (Number.isInteger(totalPrice * num)) {
              totalPrice = totalPrice * num;
            } else {
              totalPrice = (totalPrice * num).toFixed(2);
            }
            this.setData({ detail, roomCost, totalPrice });
          }
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
            const min = this.leadingZeros(date.min, 2) + ':';
            const sec = this.leadingZeros(date.sec, 2);
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
    app.goPay(this.data.id, this.data.flag);
  },
  goReserve() {
    wx.switchTab({
      url: '/pages/booking/booking'
    });
  }
})