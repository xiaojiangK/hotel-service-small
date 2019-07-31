// pages/getPhone/getPhone.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    logo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'hotel',
      success: (res) => {
        let { name,app_logo } = res.data
        this.setData({
          name: name,
          logo: app_logo
        })
      }
    })    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //  是否有手机号
  getUserPhoneNumber(e) {
    app.getUserPhoneNumber(e, this);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})