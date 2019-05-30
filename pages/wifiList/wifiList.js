const app = getApp();
const wifiData = require("../../config/json")

Page({
  data: {
    bssid: "",//Wi-Fi 的ISSID
    pwd: "",
    list: []
  },
  onLoad (options) {
    this.loadData();
  },
  loadData() {
    const data = wifiData.wifiJsonList.data.a.wifi  //圣美wifi列表
    let list = data.sort(this.compare("ssid"))
    this.setData ({ list })
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
    const bssid = e.currentTarget.dataset.id
    const pwd = e.currentTarget.dataset.pwd
    this.setData({ bssid, pwd })
    //检测手机型号
    wx.getSystemInfo({
      success: function (res) {
        var system = '';
        if (res.platform == 'android') system = parseInt(res.system.substr(8));
        if (res.platform == 'ios') system = parseInt(res.system.substr(4));
        if (res.platform == 'android' && system < 6) {
          wx.showToast({
            title: '手机版本支持6以上',
          })
          return
        }
        if (res.platform == 'ios' && system < 11.2) {
          wx.showToast({
            title: '手机版本支持11以上',
          })
          return
        }
        //2.初始化 Wi-Fi 模块
        that.startWifi();
      }
    })
  },
  //初始化 Wi-Fi 模块
  startWifi: function () {
    const that = this
    const SSID = that.data.bssid;
    const password = that.data.pwd;
    wx.startWifi({
      success: function (res) {
        wx.showLoading({
          title: '连接中',
        })
        //请求成功连接Wifi
        that.Connected();
      },
      fail: function (res) {
        wx.navigateTo({
          url: "/pages/wifiFail/wifiFail?name=" + SSID +"&pwd="+ password
        })
      }
    })
  },
  Connected: function () {
    const that = this;
    const SSID = that.data.bssid;
    const password = that.data.pwd;
    wx.connectWifi({
      SSID: that.data.bssid,
      BSSID: that.data.bssid,
      password: that.data.pwd,
      success: function (res) {
        wx.showToast({
          title: 'wifi连接成功',
        })
      },
      fail: function (res) {
        wx.stopWifi({
          success(res) { }
        })
        wx.navigateTo({
          url: "/pages/wifiFail/wifiFail?name=" + SSID +"&pwd="+ password
        })
      }
    })
  }

});