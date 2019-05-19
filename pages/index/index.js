const app = getApp()

Page({
  data: {
    swiperData: [],
    isGetUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bindGetUserInfo();
    this.loadData();
  },

  
  //  生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },
  loadData(){
    // 酒店周边
    app.util.request({
      url: "entry/wxapp/Periphery",
      success:(res) => {
        console.log(res);
      }
    });
    // 酒店超市
    app.util.request({
      url: "entry/wxapp/Goods",
      success:(res) => {
        console.log(res);
      }
    });
    // 酒店服务
    app.util.request({
      url: "entry/wxapp/Service",
      success:(res) => {
        console.log(res);
      }
    });
    // 酒店设施
    app.util.request({
      url: "entry/wxapp/Volume",
      success:(res) => {
        console.log(res);
      }
    });
    // 酒店详情
    app.util.request({
      url: "entry/wxapp/PjDetails",
      data: {
        seller_id: 1
      },
      success:(res) => {
        console.log(res);
      }
    });
    
    // var res = {
    //   state:"ok",
    //   data:[
    //     'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    //     'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
    //     'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    //   ]
    // }
    // if(res.state == 'ok'){
    //   this.setData({
    //     swiperData: res.data
    //   })
    // }
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
})
