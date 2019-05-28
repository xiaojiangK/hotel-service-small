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
    //取json里wifi名字
    this.setData ({
      list: wifiData.wifiJsonList.data.a.wifi
    })
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