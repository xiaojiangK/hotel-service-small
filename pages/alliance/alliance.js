const app = getApp()
Page({  
  onShow(){
    let _this = this
    // wx.getStorage({
    //   key: 'hotel',
    //   success: function(res) {
    //     let { openid,name} = res.data
    //     _this.getSignTotal(openid, name)
    //   },
    // })
    this.bindGetUserInfo();
  },
  bindGetUserInfo() {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        this.getSignTotal(res.data.openid, res.data.name)//获取访问次数
      },
      fail: () => {
        console.log('获取数据失败')
      }
    });
  },
  getSignTotal(openid, name) {
    const a = wx.getAccountInfoSync() ? wx.getAccountInfoSync() : {}
    if (openid == 'undefined') {
      wx.login({
        success: res1 => {
          app.util.request({
            url: "entry/wxapp/Openid",
            data: {
              code: res1.code
            },
            success: (res2) => {
              openid = res2.data.openid
            }
          });
        }
      });
    }
    wx.request({
      url: 'https://j.showboom.cn/app/index.php?i=4&t=1&v=1.0.0&from=wxapp&c=entry&a=wxapp&do=wxUserAccessLog&m=zh_jdgjb',
      method: 'POST',
      data: {
        access_type: 'tonight',
        access_page: 'tonight',
        sourcefrom: "hotelmp",
        wx_nick_name: name,
        wxopenid: openid,
        app_id: a.miniProgram.appId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  onShareAppMessage: function () {
  }
})