const app = getApp()

Page({
  data: {
    isGetUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.changeUserInfo()
    // this.loadData();
  },

  
  //  生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },
  loadData(){
  
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
