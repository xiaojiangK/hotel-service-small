Page({
  data: {
    ssid: "",
    pwd: ""
  },
  onLoad: function (options) {
    console.log (options)
    this.setData({  
      ssid: options.name,
      pwd: options.pwd  
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
  }
 
})