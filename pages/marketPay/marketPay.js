// pages/marketPay/marketPay.js
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
    hotelid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getStorage({
      key: 'hotel',
      success: (res) => {
        this.data.hotelid = res.data.id;
      }
    });
    let hash = {}
    let newArr = []
    newArr = app.globalData.shopCar.reduce((pre, item) => {
      if (hash[item.goods_id]) {
        let a = pre.find(c => c.goods_id == item.goods_id)
        a.num += 1
        hash[item.goods_id] += 1
        item.num += 1
      } else {
        hash[item.goods_id] = 1
        item.num = 1
        pre.push(item)
      }
      return pre
    }, [])
    //console.log(hash)
    app.globalData.newArr = newArr

    let allPrice = 0
    let allNum = 0
    newArr.forEach(i => {
      allPrice += i.specifications[0].goods_price * i.num
      allNum += i.num
    })
    this.setData({
      goods: newArr,
      allPrice,
      allNum
    })
  },
  getGoods(e){
    let { allPrice, allNum } = e.detail
    this.setData({
      allPrice,
      allNum
    })
  },
  roomChange(e) {
    this.setData({
      roomNum: e.detail.value
    });
  },
  telChange(e) {
    this.setData({
      tel: e.detail.value
    });
  },
  goPay() {
    const data = this.data;
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
        const g = data.goods;
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
        app.util.request({
          url: "entry/wxapp/AddGoodsOrder",
          data: {
            openid: d.openid,
            user_id: d.id,
            uniacid: d.uniacid,
            seller_id: data.hotelid,
            price: data.allPrice,
            type: g[0].goods_attribute,
            room_num: data.roomNum,
            tel: data.tel,
            orderGoods
          },
          success:(e) => {
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
              complete:() => {
                wx.hideLoading();
              }
            });
          }
        });
      }
    });
  }
})