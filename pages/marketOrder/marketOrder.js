// pages/marketOrder/marketOrder.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    flag: 0,
    isCancle: false,//取消订单弹窗
    orderInfo: {},
    goodsCount:0
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
            url: "entry/wxapp/Refunds",
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
    // this.setData({
    //   isCancle: true
    // })
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
  // closeCancle(){
  //   this.setData({
  //     isCancle: false
  //   })
  // },
  // confirmCancle(){
  //   app.util.request({
  //     url: "entry/wxapp/CancelOrder",
  //     data: {
  //       flag: this.data.flag,
  //       order_id: this.data.id
  //     },
  //     success: (res) => {
  //       if (res.data == 1) {
  //         wx.showToast({
  //           title: '取消成功',
  //           icon: 'none'
  //         });
  //         const d = this.data.orderInfo;
  //         this.setData({
  //           isCancle: false,
  //           orderInfo: {
  //             ...d,
  //             status: 3
  //           }
  //         });
  //         wx.navigateTo({
  //           url: '/pages/payComplete/payComplete?type=1'
  //         });
  //       }
  //     }
  //   });
  // },
  loadData() {
    app.util.request({
      url: "entry/wxapp/orderdetails",
      data: {
        flag: this.data.flag,
        order_id: this.data.id
      },
      success:(res) => {
        let goodsList = res.data.goods_info
        let num = 0
        goodsList.forEach(item => {
          num += Number(item.number)
        })
        this.setData({
          goodsNum: num,
          orderInfo: res.data 
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(op) {
    this.data.id = op.id;
    this.data.flag = op.flag;
    this.loadData();
  },
  onShareAppMessage: function () {
  }
})