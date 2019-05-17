const app = getApp()
const request = require("../../utils/request")

Page({
  data: {
    swiperData: "",
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
    // request.getBannnerInfo()
    var that = this,
    res = {
      state:"ok",
      data:[
        // 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
        // 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
        'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
      ]
    }
    if(res.state == 'ok'){
      that.setData({
        swiperData:res.data
      })
      console.log()
    }
  },

  bindGetUserInfo() {
    let _this = this
    // 登录
    wx.login({
      success: res1 => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: "https://u.showboom.cn/ucenter/device/api/index",
          method: 'POST',
          data: {
            service: "zdPermit",
            code: res1.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: function (res2) {
            wx.getSetting({
              success(res) {
                console.log(res.authSetting)
                if (res.authSetting["scope.userInfo"]){
                  wx.getUserInfo({
                    success: function (res3) {
                      // 可以将 res 发送给后台解码出 unionId
                      wx.request({
                        url: "https://u.showboom.cn/ucenter/device/api/index",
                        method: 'POST',
                        data: {
                          service: "zdSmallLogin",
                          data: res3.encryptedData,
                          skey: res2.data.data.sessKey,
                          iv: res3.iv
                        },
                        header: {
                          'content-type': 'application/x-www-form-urlencoded',
                        },
                        success: function (res4) {                       
                          app.globalData.userInfo.uid = res4.data.data.uid;
                          wx.setStorage({
                            key: 'userinfo',
                            data: {
                              uid: res4.data.data.uid,
                              nickName: res3.userInfo.nickName,
                              avatarUrl: res3.userInfo.avatarUrl
                            }
                          });

                        },
                        fail: function (error) {
                          reject(error)
                        }
                      });
                      //读取用户详细信息unionId
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(res)
                      }
                    }
                  })
                }else{
                  that.setData({
                    isGetUserInfo: true
                  })
                }
              }
            })
          },
          fail: function (error) {
            reject(error)
          }
        });
      }
    })
    var that = this;

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  getUserInfo(e){
    console.log(e)
    if(e){
      this.setData({
        isGetUserInfo: false
      })
      this.bindGetUserInfo() 
    }
  }
})
