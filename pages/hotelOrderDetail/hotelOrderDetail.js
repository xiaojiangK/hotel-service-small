// pages/hotelOrderDetail/hotelOrderDetail.js
import { $wuxCountDown } from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 倒计时
    this.c3 = new $wuxCountDown({
      date: +(new Date) + 10000,
      onEnd() {
        console.log(1)
        this.setData({
          c3: '重新获取',
        })
      },
      render(date) {
        const min = this.leadingZeros(date.min, 2) + ' 分 '
        const sec = this.leadingZeros(date.sec, 2) + ' 秒 '
        this.setData({
          c3: min + sec,
        })
      }
      
    })
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