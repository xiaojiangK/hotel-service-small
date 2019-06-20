Component({
  /**
   * 组件的属性列表
   */
  properties: {
    service: {
      type: Array,
      value: [{
          navigator: '../morningVolume/morningVolume?type=volume',
          url: '/assets/image/index-volume.png',
          text: '早餐券',
        }, {
          navigator: '../supermarket/supermarket',
          url: '/assets/image/index-supermarket.png',
          text: '酒店超市',
        }, {
          navigator: '../hotelFacility/hotelFacility?type=facility',
          url: '/assets/image/index-facility.png',
          text: '酒店设施',
        }, {
          navigator: '../hotelRim/hotelRim',
          url: '/assets/image/index-periphery.png',
          text: '酒店周边',
        }
      ] 
    },
    widget: {
      type: Object,
      observer: function(newVal, oldVal) {
        this.setData({
          style: newVal.style
        });
      }
    }
  },

  data: {
    style: {},
    wifiType: '',
    isShow: true, //wifi功能是否隐藏
    accountNumber: '',//Wi-Fi 的SSID，即账号
    bssid: '',//Wi-Fi 的ISSID
    password: '',//Wi-Fi 的密码
  },
  lifetimes: {
    // 生命周期函数
    attached: function () {
      // this.loadData()
    }
  },
  methods: {
    loadData() {
      // let res = wx.getStorageSync('wifiList')
      // this.handleTypeSucc(res)  
      // wx.getStorage({
      //   key: 'hotel',
      //   success: (res)=>{
      //     this.handleTypeSucc(res)       
      //   }
      // });
    },
    //wifi类型判断
    // handleTypeSucc(res) {
    //   if (res.data.wifi != "1") {
    //     this.setData({
    //       isShow: false
    //     })
    //   }
    // },
    getWifiList(){
      let res = wx.getStorageSync('wifiList')
      if (res.length > 1) {
        this.setData({
          wifiType: "list"
        })
      } else if (res.length == 1) {
        this.setData({
          wifiType: "info",
          accountNumber: res[0].wifi_name,
          bssid: res[0].wifi_name,
          password: res[0].wifi_pwd
        })
      }else{
        this.setData({
          wifiType: 'none'
        })
      }
    },
    connectWifi: function () {
      this.getWifiList()
      if (this.data.wifiType == 'none'){
        wx.showModal({
          title: '温馨提示',
          content: '酒店暂未开放此功能',
          showCancel: false
        })
      } else if (this.data.wifiType == 'list'){
        wx.navigateTo({
          url: '/pages/wifiList/wifiList',
        })
      }else{
        const that = this;
        //检测手机型号
        wx.getSystemInfo({
          success: function (res) {
            var system = '';
            if (res.platform == 'android') system = parseInt(res.system.substr(8));
            if (res.platform == 'ios') system = parseInt(res.system.substr(4));
            if (res.platform == 'android' && system < 6) {
              wx.showModal({
                title: '温馨提示',
                content: '支持安卓6以上的版本',
              })
              return
            }
            if (res.platform == 'ios' && system < 11.2) {
              wx.showModal({
                title: '温馨提示',
                content: '支持IOS11以上的版本',
              })
              return
            }
            that.startWifi();//初始化 Wi-Fi 模块
          }
        })
      }
    },
    wifiNext(){
      this.getWifiList()
      if (this.data.wifiType == 'none'){
        wx.showModal({
          title: '温馨提示',
          content: '酒店暂未开放此功能',
          showCancel: false
        })
      }else{
        let url = this.data.wifiType == 'list' ? '/pages/wifiList/wifiList?title=none' : '/pages/wifiFail/wifiFail?name=' + this.data.bssid + '&pwd=' + this.data.password
        wx.navigateTo({
          url: url,
        })
      }
    },
    //初始化 Wi-Fi 模块
    startWifi: function () {
      const that = this
      const SSID = that.data.bssid;
      const password = that.data.password;
      wx.startWifi({
        success: function (res) {
          // wx.showLoading({
          //   title: '连接中'
          // })
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
    //连接wifi
    Connected: function () {
      const that = this;
      const SSID = that.data.bssid;
      const password = that.data.password;
      wx.connectWifi({
        SSID: that.data.accountNumber,
        BSSID: that.data.bssid,
        password: that.data.password,
        success: function (res) {
          wx.showToast({
            title: 'wifi连接成功'
          })
        },
        fail: function (res) {
          wx.stopWifi({
            success(res) {}
          })
          wx.navigateTo({  
            url: "/pages/wifiFail/wifiFail?name=" + SSID +"&pwd="+ password
          })
        }
      })
    }
  }
})
