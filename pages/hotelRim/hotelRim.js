// pages/hotelRim/hotelRim.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    periphery:1,
    isHasList:false,
    isNoList: false
  },
  loadData() {
    // 酒店周边
    let _this = this
    wx.getStorage({
      key: 'hotel',
      success: function (res) {
        let { periphery } = res.data
        _this.setData({
          periphery: periphery
        })
      },
    })
    app.util.request({
      url: "entry/wxapp/Periphery",
      success:(res) => {
        const list = res.data.map(item => {
          return {
            ...item,
            img: item.img + app.globalData.imgSize,
          }
        });
        if (list.length > 0 && this.data.periphery == 1 ){
          this.setData({ list, isHasList:true });
        }else{
          this.setData({ list, isNoList: true });
        }
        
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.loadData();
  },
  goCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    });
  },
  onShareAppMessage: function () {
  }
})