//app.js
App({

  onLaunch () {
  },
  userLogin() {
    // 登录
    wx.login({
      success: res1 => {
        this.util.request({
          url: "entry/wxapp/Openid",
          data: {
            code: res1.code
          },
          success:(res2) => {
            wx.getSetting({
              success:(res) => {
                if (res.authSetting["scope.userInfo"]){
                  wx.getUserInfo({
                    success:(res3) => {
                      this.util.request({
                        url: "entry/wxapp/login",
                        data: {
                          openid: res2.data.openid,
                          img: res3.userInfo.avatarUrl,
                          name: res3.userInfo.nickName
                        },
                        success:(res4) => {
                          this.globalData.userInfo.openid = res4.data.openid;
                          wx.setStorage({
                            key: 'userinfo',
                            data: {
                              openid: res4.data.openid,
                              nickName: res3.userInfo.nickName,
                              avatarUrl: res3.userInfo.avatarUrl
                            }
                          });
                        }
                      });
                    }
                  })
                }
              }
            });
          }
        });
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    });
  },
  util: require("utils/util.js"),
  globalData: {
    userInfo: null
  }
})