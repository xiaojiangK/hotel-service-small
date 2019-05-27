const app = getApp();
const config = require('../../config/index');

Page({
  data: {
    detail: {},
    volume: [],
    goods: [],
    periphery: [],
    isGetUserInfo: false,
    isGetPhoneNumber: false,
    hotelName: "",
    widgets: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.loadData();
  },
  onShow() {
    this.bindGetUserInfo();
  },
  loadData(){
    // 酒店详情
    app.util.request({
      url: "entry/wxapp/GetSystem",
      success:(res) => {
        app.util.request({
          url: "entry/wxapp/PjDetails",
          data: {
            seller_id: res.data.id
          },
          success:(res) => {
            const item = res.data;
            this.setData({
              hotelName: item.name
            })
            const detail = {
              ...item,
              img: item.img.split(',').map(item => {
                return app.globalData.url + item
              }),
              coordinates: item.coordinates.split(',')
            }
            wx.setStorage({
              key: 'hotel',
              data: detail
            });
            this.setData({ detail });
          }
        });
        wx.setStorage({
          key: 'system',
          data: res.data
        });
      }
    });
    // 酒店设施
    // app.util.request({
    //   url: "entry/wxapp/Volume",
    //   success:(res) => {
    //     const volume = res.data.map(item => {
    //       return {
    //         ...item,
    //         goods_img: app.globalData.url + item.goods_img
    //       }
    //     });
    //     this.setData({ volume });
    //   }
    // });
    // 酒店超市
    // app.util.request({
    //   url: "entry/wxapp/Goods",
    //   success:(res) => {
    //     const goods = res.data.map(item => {
    //       return {
    //         ...item,
    //         goods_img: app.globalData.url + item.goods_img
    //       }
    //     });
    //     this.setData({ goods });
    //   }
    // });
    // 酒店周边
    // app.util.request({
    //   url: "entry/wxapp/Periphery",
    //   success:(res) => {
    //     const periphery = res.data.map(item => {
    //       return {
    //         ...item,
    //         img: app.globalData.url + item.img
    //       }
    //     });
    //     this.setData({ periphery });
    //   }
    // });
    // 挂件数据
    wx.request({
      url: `${config.baseURL}api/index.php`,
      data: {
        method: 'get_page',
        uniacid: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: (res) => {
        this.setData({ widgets: res.data });
      }
    });
  },
  bindGetUserInfo() {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        if(res.data.tel) {
          this.setData({
            isGetPhoneNumber: false
          });
        } else {
          this.setData({
            isGetPhoneNumber: true
          });
        }
      },
      fail: () => {
        this.setData({
          isGetUserInfo: true
        });
      }
    });
  },
  getUserInfo(e){
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.userLogin();
      this.setData({
        isGetUserInfo: false
      });
    }
  },
  getUserPhoneNumber(e){
    app.getUserPhoneNumber(e);
    app.userLogin();
    this.bindGetUserInfo();
  }
})
