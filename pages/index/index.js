const app = getApp();
const config = require('../../config/index');

Page({
  data: {
    detail: {},
    volume: [],
    goods: [],
    periphery: [],
    isGetUserInfo: false,
    isGetPhoneNumber: false,
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
    app.util.request({
      url: "entry/wxapp/GetSystem",
      success:(res) => {
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
              img: item.img.split(','),
              coordinates: item.coordinates.split(',')
            }
            wx.setStorage({
              key: 'hotel',
              data: detail
            });
            this.setData({ detail });
          }
        });
        wx.setStorage({
          key: 'system',
          data: res.data
        });
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
  bindGetUserInfo() {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        if(res.data.tel) {
          this.getSignTotal(res.data.openid, res.data.name)//获取访问次数
          this.setData({
            isGetPhoneNumber: false
          });
        } else {
          this.setData({
            isGetPhoneNumber: true
          });
        }
      },
      fail: () => {
        this.setData({
          isGetUserInfo: true
        });
      }
    });
  },
  getUserInfo(e){
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.userLogin();
      this.setData({
        isGetUserInfo: false
      });
    }
  },
  getSignTotal(openid,name){
    const a = wx.getAccountInfoSync() ? wx.getAccountInfoSync() : {}
    console.log(a)
    if(openid=='undefined'){
      wx.login({
        success: res1 => {
          app.util.request({
            url: "entry/wxapp/Openid",
            data: {
              code: res1.code
            },
            success: (res2) => {
             console.log(res2)
            }
          });
        }
      });
    }
    wx.request({
      url: 'https://j.showboom.cn/app/index.php?i=4&t=1&v=1.0.0&from=wxapp&c=entry&a=wxapp&do=wxUserAccessLog&m=zh_jdgjb',
      method: 'POST',
      data: {
        type: 'index',
        page: 'index',
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
  getUserPhoneNumber(e){
    app.getUserPhoneNumber(e);
    app.userLogin();
    this.bindGetUserInfo();
  },
  onShareAppMessage: function (res) {
  }
})
