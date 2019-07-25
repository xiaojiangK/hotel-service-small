const app = getApp();

Page({
  data: {
    list: [],
    bssid: "",//Wi-Fi 的ISSID
    pwd: "",
    type: "",
    authentication: '2',
    phoneType:''//手机类型
  },
  onLoad (options) {
    this.loadData();
    if (options.title){
      this.setData({
        type: options.title
      }) 
    }
  },
  onShow(){
    wx.hideLoading()
  },
  loadData() {
    wx.getStorage({
      key: 'hotel',
      success: (res)=> {
        const list = res.data.wifiList
        wx.setNavigationBarTitle({
          title: res.data.name,
        })
        // let list = data.sort(this.compare("ssid"))
        this.setData ({ list })
      }
    });
  },
  //房间号升序排列
  compare: function(propertyName) {
    return function(object1, object2) {
      let value1 = object1[propertyName];
      let value2 = object2[propertyName];
      if(value2 > value1) {
          return -1;
      } else if(value2 < value1) {
          return 1;
      } else {
          return 0;
      }
    }
  },
  connectWifi: function (e) {
    const that = this;
    const type = that.data.type;
    const bssid = e.currentTarget.dataset.id
    const pwd = e.currentTarget.dataset.pwd
    const authentication = e.currentTarget.dataset.authentication
    this.setData({ bssid, pwd, authentication })
    //如果直接点击wifi密码进入 不需连接
    if (type == "none") {
      wx.navigateTo({
        url: "/pages/wifiFail/wifiFail?name=" + bssid + "&pwd=" + pwd + '&authentication=' + authentication
      })
    }else {
       //检测手机型号
      wx.getSystemInfo({
        success: function (res) {
          var system = '';
          that.setData({
            phoneType: res.platform
          })
          if (res.platform == 'android') system = parseInt(res.system.substr(8));
          if (res.platform == 'ios') system = parseInt(res.system.substr(4));
          if (res.platform == 'android' && system < 6) {
            wx.showModal({
              title: '温馨提示',
              content: '此功能微信仅支持Android 6以上版本，可查看密码手动连接WiFi',
              confirmText: '查看密码',
              showCancel: false,
              success: function(res){
                if(res.confirm){
                  wx.navigateTo({
                    url: "/pages/wifiFail/wifiFail?name=" + bssid + "&pwd=" + pwd + '&authentication=' + authentication
                  })
                }else{
                  return
                }
              }
            })
          }
          if (res.platform == 'ios' && system < 11.2) {
            wx.showModal({
              title: '温馨提示',
              content: '此功能微信仅支持iOS 11以上版本，可查看密码手动连接WiFi',
              confirmText: '查看密码',
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: "/pages/wifiFail/wifiFail?name=" + bssid + "&pwd=" + pwd + '&authentication=' + authentication
                  })
                } else {
                  return
                }
              }
            })
          }
          //2.初始化 Wi-Fi 模块
          that.startWifi();
        }
      })
    }
  },
  //初始化 Wi-Fi 模块
  startWifi: function () {
    const that = this
    const SSID = that.data.bssid;
    const password = that.data.pwd;
    let authentication = that.data.authentication
    if (authentication == 1){
      wx.navigateTo({
        url: "/pages/wifiFail/wifiFail?name=" + SSID + "&pwd=" + password + '&authentication=' + authentication
      })
      return
    }
    wx.startWifi({
      success: function (res) {
        wx.showLoading({
          title: '连接中',
        })
        //请求成功连接Wifi
        that.connected();
      },
      fail: function (res) {
        wx.navigateTo({
          url: "/pages/wifiFail/wifiFail?name=" + SSID + "&pwd=" + password + '&authentication=' + authentication
        })
      }
    })
  },
  connected: function () {
    const that = this;
    const SSID = that.data.bssid;
    const password = that.data.pwd;
    let authentication = that.data.authentication
    let phoneType = that.data.phoneType
    wx.connectWifi({
      SSID: that.data.bssid,
      BSSID: that.data.bssid,
      password: that.data.pwd,
      success: function (res) {
        wx.showToast({
          title: 'wifi连接成功'
        })
      },
      fail: function (res) {
        wx.stopWifi({
          success(res) { }
        })
        if (res.errCode) {
          wx.navigateTo({
            url: "/pages/wifiFail/wifiFail?name=" + SSID + "&pwd=" + password + '&authentication=' + authentication + '&errCode=' + res.errCode
          })
        }else{
          wx.navigateTo({
            url: "/pages/wifiFail/wifiFail?name=" + SSID + "&pwd=" + password + '&authentication=' + authentication
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
  }

});