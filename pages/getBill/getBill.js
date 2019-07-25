// pages/getBill/getBill.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    recId:'',
    amount: '',
    title: '',
    tax_number: '',
    telephone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.rec_id)
    this.setData({
      recId: options.rec_id
    })
    this.getUrl()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getUrl(){
    console.log(this.data.url)
    let _this = this
    app.util.request({
      url: "entry/wxapp/GetYpPath",
      data: {
        rec_id: this.data.recId
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.result == 'success'){
          console.log(res.data.yp_auth_path)
          let { amount,title,tax_number,telephone} = res.data.content
          _this.setData({
            url: res.data.yp_auth_path,
            amount,
            title,
            tax_number,
            telephone
          })
        }else{
          console.log(res.msg)
        }
        console.log(res)
      }
    })
  },
  goNext(){
    console.log(this.data.url)
    wx.navigateToMiniProgram({
      appId: 'wx9db2c16d0633c2e7',
      path: this.data.url,
      success(res) {
        console.log('navigateToMiniProgram success:', res)
      },
      fail(error) {
        console.log('navigateToMiniProgram fail:', error)
      },
      complete(res) {
        console.log('navigateToMiniProgram complete:', res)
      }
    })
  },
  goIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})