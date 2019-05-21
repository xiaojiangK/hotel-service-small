// pages/vipCenter/vipCenter.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    wx.navigateTo({
      url: `/pages/hotelOrderDetail/hotelOrderDetail?id=${e.currentTarget.dataset.id}`
    });
  },
  onPullDownRefresh() {
    this.loadData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadData();
  }
})
