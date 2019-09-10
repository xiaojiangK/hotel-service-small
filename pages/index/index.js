const app = getApp();
const config = require('../../config/index');

Page({
  data: {
    detail: {},
    volume: [],
    goods: [],
    periphery: [],
    hotelName: "",
    widgets: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.loadData();
  },
  onShow() {
    this.bindGetUserInfo();
  },
  loadData(){
    // 酒店详情
    wx.showLoading({
      title: '加载中',
    })

    // 获取酒店权限信息
    app.util.request({
      url: "entry/wxapp/GetSystem",
      success:(res) => {
        app.util.request({
          url: "entry/wxapp/HotelDeploy",
          data: {
            uniacid: res.data.uniacid
          },
          success: (res) => {
            if(res.data){
              app.globalData.hotelConfig = res.data.content
              wx.setStorage({
                key: 'hotelConfig',
                data: res.data.content,
              })
            }
          }
        })

        app.util.request({
          url: "entry/wxapp/PjDetails",
          data: {
            uniacid: res.data.uniacid
          },
          success:(res) => {
            const item = res.data;
            this.setData({
              hotelName: item.name
            })
            wx.setNavigationBarTitle({
              title: item.name,
            })
            const detail = {
              ...item,
              ewm_logo: item.ewm_logo + app.globalData.imgSize,
              coordinates: item.coordinates.split(',')
            }
            let { wifiList } = detail

            wx.setStorage({
              key: 'hotel',
              data: detail
            });
            wx.setStorageSync('wifiList', wifiList)
            this.setData({ detail });
            let indexService = this.selectComponent('#index-service');
            indexService.loadData();
          }
        });
        wx.setStorage({
          key: 'system',
          data: res.data
        });
        let mchid  = res.data.mchid
        if (mchid) {
          app.globalData.isMchid = true
        }
      }
    });
    // 酒店设施
    // app.util.request({
    //   url: "entry/wxapp/Volume",
    //   success:(res) => {
    //     this.setData({ volume: res.data });
    //   }
    // });
    // 酒店超市
    // app.util.request({
    //   url: "entry/wxapp/Goods",
    //   success:(res) => {
    //     this.setData({ goods: res.data });
    //   }
    // });
    // 酒店周边
    // app.util.request({
    //   url: "entry/wxapp/Periphery",
    //   success:(res) => {
    //     this.setData({ periphery: res.data });
    //   }
    // });
    // 挂件数据
    wx.request({
      url: `${config.baseURL}api/index.php`,
      data: {
        method: 'get_page',
        uniacid: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: (res) => {
        this.setData({ widgets: res.data });
        wx.hideLoading();
      }
    });
  },
  getUserPhoneNumber(e) {
    app.getUserPhoneNumber(e, this);
  },
  bindGetUserInfo() {
    this.setData({
      isGetUserInfo: false
    });
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
  closeAlert() {
    this.setData({
      isGetUserInfo: false
    });
  },
  getSetting() {
    wx.getSetting({
      success: (res)=>{
        if (!res.authSetting['scope.userInfo']) {
          this.setData({
            isGetUserInfo: true
          });
        }
      }
    });
  },
  getUserInfo(e){
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.getUserInfo({
        success: (res) => {
          wx.setStorage({
            key: 'user',
            data: res
          });
          app.userLogin(res);
        }
      });
    }
  },
  getSignTotal(openid,name){
    const a = wx.getAccountInfoSync() ? wx.getAccountInfoSync() : {}
    if(openid=='undefined'){
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
        access_type: 'index',
        access_page: 'index',
        sourcefrom:"hotelmp",
        wx_nick_name:name,
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
