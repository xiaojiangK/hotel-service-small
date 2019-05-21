const app = getApp()

Page({
  data: {
    detail: {},
    volume: [],
    goods: [],
    periphery: [],
    isGetUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bindGetUserInfo();
    this.loadData();
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
    app.util.request({
      url: "entry/wxapp/Volume",
      success:(res) => {
        const volume = res.data.map(item => {
          return {
            ...item,
            goods_img: app.globalData.url + item.goods_img
          }
        });
        this.setData({ volume });
      }
    });
    // 酒店超市
    app.util.request({
      url: "entry/wxapp/Goods",
      success:(res) => {
        const goods = res.data.map(item => {
          return {
            ...item,
            goods_img: app.globalData.url + item.goods_img
          }
        });
        this.setData({ goods });
      }
    });
    // 酒店周边
    app.util.request({
      url: "entry/wxapp/Periphery",
      success:(res) => {
        const periphery = res.data.map(item => {
          return {
            ...item,
            img: app.globalData.url + item.img
          }
        });
        this.setData({ periphery });
      }
    });
  },

  bindGetUserInfo() {
    wx.getStorage({
      key: 'userinfo',
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
  }
  // changeUserInfo(){//判断用户是否已经授权
  //   var that = this
  //   if(app.globalData.userInfo != '')
  //     that.setData({
  //       isGetUserInfo:false
  //     })
  //   else
  //     that.setData({
  //       isGetUserInfo:true
  //     }) 
  // },
  // getUserInfo(e){//获取用户信息
    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       // 发起网络请求
    //       wx.request({
    //         url: '',
    //         data: {
    //           code: res.code
    //         },
    //         success(res) {
    //           // console.log(res.data.openid)
    //         }
    //       })
    //     }
    //   }
    // })
    // if(e.detail.userInfo){ //同意授权
    //   app.globalData.userInfo = e.detail.userInfo
    //   wx.setStorageSync('userInfo',e.detail.userInfo)
    //   this.changeUserInfo()
    // }
  // }
})
