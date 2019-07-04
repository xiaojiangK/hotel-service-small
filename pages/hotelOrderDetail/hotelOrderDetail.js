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
    isReply: false,
    isAssess: false,
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
  onShow() {
    this.getAssess();
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

        let totalPrice = 0;
        d.roomCost.map(item => {
          totalPrice += Number.parseFloat(item.mprice);
        });
        const num = detail.num;
        if (Number.isInteger(totalPrice * num)) {
          totalPrice = totalPrice * num;
        } else {
          totalPrice = (totalPrice * num).toFixed(2);
        }
 
        let rebate = 0;
        let vipInfo = {};
        // 获取会员折扣
        wx.getStorage({
          key: 'vipInfo',
          success: (res) => {
            vipInfo = res.data;
            if (vipInfo.is_vip == 1) {
              rebate = (totalPrice - (totalPrice * vipInfo.vip_coupon)).toFixed(2)
            }
          },
          complete: () => {
            this.setData({
              rebate,
              detail,
              vipInfo,
              totalPrice: totalPrice.toFixed(2)
            });
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
  // 获取评论列表
  getAssess() {
    app.util.request({
      url: "entry/wxapp/AssessList",
      data: {
        order_id: this.data.id
      },
      success: (res) => {
        for (let i of res.data) {
          if (i.reply) {
            this.setData({
              isReply: true
            });
          }
        }
        if (res.data.length > 0) {
          this.setData({
            isAssess: true
          });
        }
      }
    });
  },
  // 查看评论
  viewComment() {
    wx.navigateTo({
      url: `/pages/comment/comment?orderId=${this.data.id}`
    });
  },
  goComment() {
    const item = this.data.detail;
    wx.navigateTo({
      url: `/pages/submitComment/submitComment?roomId=${item.room_id}&orderId=${item.id}`
    });
  },
  goPay() {
    app.goPay(this.data.id, this.data.flag);
  },
  goReserve() {
    wx.switchTab({
      url: '/pages/booking/booking'
    });
  },
  onShareAppMessage: function () {
  }
})