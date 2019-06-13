// pages/marketPay/marketPay.js
var siteinfo = require("../../siteinfo.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: '',
    goods: [],
    roomNum: '',
    allNum:0,
    allPrice:0,
    hotelid: 0,
    isIphoneX: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isIphoneX = app.globalData.isIphoneX;
    if (isIphoneX) {
      this.setData({
        isIphoneX: isIphoneX
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        this.setData({
          tel: res.data.tel
        });
      }
    });
    
    wx.getStorage({
      key: 'hotel',
      success: (res) => {
        this.data.hotelid = res.data.id;
      }
    });
    //console.log(hash)
    let newArr = app.globalData.newArr

    let allPrice = 0
    let allNum = 0
    newArr.forEach(i => {
      allPrice += i.specifications[0].goods_price * i.num
      allNum += i.num
    })
    allPrice = allPrice.toFixed(2)
    this.setData({
      goods: newArr,
      allPrice,
      allNum
    })
  },
  getGoods(e){
    let { allPrice, allNum } = e.detail
    let goods = app.globalData.newArr
    this.setData({
      goods,
      allPrice,
      allNum
    })
  },
  roomChange(e) {
    this.data.roomNum = e.detail.value;
  },
  telChange(e) {
    this.data.tel = e.detail.value;
  },
  goPay() {
    const data = this.data;
    const g = data.goods;
    if (g && g.length <= 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      });
      return;
    }
    if (!data.roomNum) {
      wx.showToast({
        title: '请输入房间号',
        icon: 'none'
      });
      return;
    }
    if (data.tel.length < 11) {
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
      key: 'userinfo',
      success: (res) => {
        const d = res.data;
        let orderGoods = [];
        for (let i of g) {
          if (i.specifications instanceof Array) {
            orderGoods.push({
              spec_id: i.specifications[0].id,
              name: i.goods_name,
              img: i.goods_img,
              type: i.goods_attribute,
              price: i.specifications[0].goods_price,
              number: i.num,
              total_price: data.allPrice
            });
          }
        }
        let url = "entry/wxapp/AddGoodsOrders"
        if (siteinfo.uniacid==4){
          url = "entry/wxapp/AddGoodsOrder"
        }
        app.util.request({
          url: url,
          data: {
            openid: d.openid,
            user_id: d.id,
            uniacid: d.uniacid,
            seller_id: data.hotelid,
            price: data.allPrice,
            type: g[0].goods_attribute,
            room_num: data.roomNum,
            phone: data.tel,
            orderGoods
          },
          success:(e) => {
            // 零元不走微信支付
            if (e.data.code == 1) {
              wx.showToast({
                title: '恭喜您，支付成功!',
                icon: 'none'
              });
              wx.navigateTo({
                url: '/pages/payComplete/payComplete'
              });
              return;
            }
            if (e.data.code == 0) {
              wx.showToast({
                title: e.data.msg,
                icon: 'none'
              });
            } else {
              wx.requestPayment({
                timeStamp: e.data.timeStamp,
                nonceStr: e.data.nonceStr,
                package: e.data.package,
                signType: e.data.signType,
                paySign: e.data.paySign,
                success:(e) => {
                  wx.showToast({
                    title: '恭喜您，支付成功!',
                    icon: 'none'
                  });
                  wx.navigateTo({
                    url: '/pages/payComplete/payComplete'
                  });
                },
                fail:(e) => {
                  wx.showToast({
                    title: "支付失败"
                  });
                },
                complete:() => {
                  wx.hideLoading();
                  if (res.errMsg === 'requestPayment:fail cancel') {
                    wx.navigateTo({
                      url: '/pages/orderList/orderList'
                    });
                  }
                }
              });
            }
          }
        });
      }
    });
  }
})