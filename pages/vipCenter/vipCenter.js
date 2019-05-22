// pages/vipCenter/vipCenter.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    userInfo: {},
    orderList: [],
    totalPrice: 0,
    tel: 13800138000
  },
  goCall () {
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    });
  },
  loadData() {
    wx.showNavigationBarLoading();
    wx.getStorage({
      key: 'userinfo',
      success: (res)=>{
        this.setData({ userInfo: res.data });
        app.util.request({
          url: "entry/wxapp/MyOrder",
          data: {
            uniacid: res.data.uniacid,
            user_id: res.data.id,
            page: this.data.page
          },
          success:(res) => {
            let totalPrice = 0;
            for (let i of res.data) {
              totalPrice += Number.parseFloat(i.price);
            }
            this.setData({
              totalPrice,
              orderList: res.data
            });
            wx.hideLoading();
            wx.hideNavigationBarLoading();
          }
        });
      }
    });
    wx.getStorage({
      key: 'hotel',
      success: (res)=>{
        this.setData({ tel: res.data.tel });
      }
    });
  },
  goDetail(e) {
    const item = e.currentTarget.dataset.item;
    if (item.flag == '0') {
      wx.navigateTo({
        url: `/pages/hotelOrderDetail/hotelOrderDetail?id=${item.id}&flag=${item.flag}`
      });
    } else if (item.flag == '1') {
      wx.navigateTo({
        url: `/pages/marketOrder/marketOrder?id=${item.id}&flag=${item.flag}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/serviceOrderDetail/serviceOrderDetail?id=${item.id}&flag=${item.flag}`
      });
    }
  },
  onPullDownRefresh() {
    this.loadData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.loadData();
  }
})
