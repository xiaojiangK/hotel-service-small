var app = getApp();

Page({
  data: {
    //  房间数集合索引
    roomNumberIndex: 0,
    //  房间数集合
    roomNumberArray: [1,2,3,4,5,6,7,8,9,10],
    //  房间数
    roomNumber: 1,
    //  预计办理入住时间起始值
    startCheckInTime: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
    //  预计办理入住时间
    checkInTime: '',
    //  是否显示金额明细
    isSumDetail: false
  },
  //
  bindRoomNumberChange: function (e) {
    this.setData({
      roomNumberIndex: e.detail.value,
      roomNumber: this.data.roomNumberArray[e.detail.value]
    });
  },
  //  选择预计办理入住时间
  bindDateChange: function (e) {
    this.setData({
      checkInTime: e.detail.value
    });
  },
  //  显示/隐藏金额明细
  toggleSumDetail: function () {
    this.setData({
      isSumDetail: !this.data.isSumDetail
    });
  },
  submit() {
    wx.showLoading({
      title: '支付中...',
      mask: true
    });
    app.util.request({
      url: "entry/wxapp/AddOrder",
      data: {
        
      },
      success:(e) => {
        wx.requestPayment({
          timeStamp: e.data.timeStamp,
          nonceStr: e.data.nonceStr,
          package: e.data.package,
          signType: e.data.signType,
          paySign: e.data.paySign,
          success:(e) => {
            
          },
          fail:(e) => {
            wx.showToast({
              title: "支付失败"
            });
          },
          complete:() => {
            wx.hideLoading();
          }
        });
      }
    });
  }
})