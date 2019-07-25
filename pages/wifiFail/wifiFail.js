Page({
  data: {
    ssid: "",
    pwd: "",
    authentication:'2'
  },
  onLoad: function (options) {
    if (options.errCode){
      wx.showModal({
        title: '温馨提示',
        content: '手机WiFi没有开启，请先打开WiFi',
        showCancel:false
      })
    }
    this.setData({  
      ssid: options.name,
      pwd: options.pwd,
      authentication: options.authentication  
    }) 
  },
  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
      data: that.data.pwd,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  onShareAppMessage: function () {
  }
 
})