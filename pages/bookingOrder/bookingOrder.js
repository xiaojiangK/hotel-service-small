var siteinfo = require("../../siteinfo.js");
var app = getApp();
let price = 0;

Page({
  data: {
    //  房间数集合索引
    roomNumberIndex: 0,
    //  房间数集合
    roomNumberArray: [1,2,3,4,5,6,7,8,9,10],
    //  房间数
    roomNumber: 1,
    //  预计办理入住时间起始值
    // startCheckInTime: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
    //  预计办理入住时间
    checkInTime: '',
    //  是否显示金额明细
    isSumDetail: false,
    room: { days: 1 },
    roomCost: [],
    totalPrice: 0,
    total_cost: 0,
    name: '',
    phone: '',
    userid: '',
    openid: '',
    uniacid: '',
    vipInfo: {},
    rebate: 0,
    isIphoneX: false
  },
  onLoad() {
    this.loadData();
    let isIphoneX =app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX 
    });
  },
 
  loadData() {
    wx.getStorage({
      key: 'userinfo',
      success: (res)=>{
        this.data.userid = res.data.id;
        this.data.openid = res.data.openid;
        this.data.uniacid = res.data.uniacid;
      }
    });
    wx.getStorage({
      key: 'room',
      success: (res)=>{
        const room = res.data;
        this.setData({ room });
        app.util.request({
          url: "entry/wxapp/GetRoomCost",
          data: {
            room_id: room.id,
            end: `${room.end[0]}-${room.end[1]}-${room.end[2]}`,
            start: `${room.start[0]}-${room.start[1]}-${room.start[2]}`
          },
          success: (res) => {
            let totalPrice = 0;
            const roomCost = res.data.map(item => {
              totalPrice += Math.ceil(item.mprice);
              return {
                ...item,
                mprice: Math.ceil(item.mprice).toFixed(2)
              };
            });
            const num = this.data.roomNumber;
            if (Number.isInteger(totalPrice * num)) {
              totalPrice = totalPrice * num;
            } else {
              totalPrice = (totalPrice * num).toFixed(2);
            }
            price = Math.ceil(totalPrice);
            let rebate = 0;
            let vipInfo = {};
            
            // 获取会员折扣
            wx.getStorage({
              key: 'vipInfo',
              success: (res) => {
                vipInfo = res.data;
                if (vipInfo.is_vip == 1) {
                  rebate = (totalPrice - totalPrice * vipInfo.vip_coupon).toFixed(2)
                }
              },
              complete: () => {
                this.setData({
                  rebate,
                  vipInfo,
                  roomCost,
                  totalPrice: Math.ceil(totalPrice).toFixed(2),
                  total_cost: (totalPrice - rebate).toFixed(2)
                });
              }
            });
          }
        });
      }
    });
  },
  inputChange(e) {
    const idx = e.currentTarget.dataset.idx;
    if (idx == 'name') {
        this.setData({ name: e.detail.value });
    }
    if (idx == 'phone') {
        this.setData({ phone: e.detail.value });
    }
},
  bindRoomNumberChange (e) {
    this.setData({
      roomNumberIndex: e.detail.value,
      roomNumber: this.data.roomNumberArray[e.detail.value]
    });
    const num = this.data.roomNumber;
    let totalPrice = 0;
    let rebate = 0;
    if (Number.isInteger(price * num)) {
      totalPrice = price * num;
    } else {
      totalPrice = (price * num).toFixed(2);
    }

    // 获取会员折扣
    wx.getStorage({
      key: 'vipInfo',
      success: (res) => {
        const data = res.data;
        if (data.is_vip == 1) {
          rebate = (totalPrice - totalPrice * data.vip_coupon).toFixed(2)
        }
      },
      complete: () => {
        this.setData({
          rebate,
          totalPrice,
          total_cost: (totalPrice - rebate).toFixed(2)
        });
      }
    });
  },
  //  选择预计办理入住时间
  bindDateChange (e) {
    this.setData({
      checkInTime: e.detail.value
    });
  },
  //  显示/隐藏金额明细
  toggleSumDetail () {
    this.setData({
      isSumDetail: !this.data.isSumDetail
    });
  },
  isRepeat(arr){
      var hash = {};
      for(var i in arr) {
          if(hash[arr[i]]) {
              return true;
          }
          hash[arr[i]] = true;
      }
      return false;
  },
  submit() {
    const data = this.data;
    const room = data.room;
    if (data.roomNumber > room.total_num) {
      wx.showToast({
        title: '房型不足!',
        icon: 'none'
      });
      return;
    }
    if (!data.name) {
      wx.showToast({
        title: '名字不能为空!',
        icon: 'none'
      });
      return;
    }
    if (!data.checkInTime) {
        wx.showToast({
          title: '请选择预计入住时间!',
          icon: 'none'
        });
        return;
    }
    if (data.phone.length < 11) {
      wx.showToast({
        title: '手机号有误',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '支付中...',
      mask: true
    });
    wx.getStorage({
      key: 'hotel',
      success: (res)=>{
        const h = res.data;
        let url = "entry/wxapp/AddOrders"
        if (siteinfo.uniacid==4){
          url = "entry/wxapp/AddOrder"
        }
        app.util.request({
          url: url,
          data: {
            is_vip: data.vipInfo.is_vip,
            vip_coupon: data.vipInfo.is_vip == 1 ? data.vipInfo.vip_coupon : '',
            roomCost: data.roomCost,
            price: data.roomCost[0].mprice,
            total_cost: data.total_cost,
            seller_name: h.name,
            seller_address: h.address,
            coordinates: `${h.coordinates[0]},${h.coordinates[1]}`,
            arrival_time: `${room.start[0]}-${room.start[1]}-${room.start[2]}`,
            departure_time: `${room.end[0]}-${room.end[1]}-${room.end[2]}`,
            dd_time: data.checkInTime,
            tel: data.phone,
            name: data.name,
            room_id: room.id,
            room_type: room.name,
            num: data.roomNumber,
            uniacid: data.uniacid,
            days: room.days,
            room_logo: room.logo,
            openid: data.openid,
            user_id: data.userid,
            seller_id: h.id,
            flag: 0
          },
          success:(e) => {
            if (e.data.code == 0) {
              wx.showToast({
                title: e.data.msg,
                icon: 'none'
              });
              return;
            }
            wx.requestPayment({
              timeStamp: e.data.timeStamp,
              nonceStr: e.data.nonceStr,
              package: e.data.package,
              signType: e.data.signType,
              paySign: e.data.paySign,
              success:() => {
                wx.showToast({
                  title: '恭喜您，支付成功!',
                  icon: 'none'
                });
                wx.navigateTo({
                  url: '/pages/payComplete/payComplete'
                });
              },
              fail:() => {
                wx.showToast({
                  title: "支付失败"
                });
              },
              complete:(res) => {
                wx.hideLoading();
                if (res.errMsg === 'requestPayment:fail cancel') {
                  wx.navigateTo({
                    url: '/pages/orderList/orderList'
                  });
                }
              }
            });
          }
        });
      }
    });
  },
  onShareAppMessage: function () {
  }
})