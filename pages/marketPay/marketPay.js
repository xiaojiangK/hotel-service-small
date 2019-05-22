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
    list:[],
    allNum:0,
    allPrice:0
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
    console.log('aaa')
    console.log(app.globalData.shopCar)
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
    console.log(newArr + 'sssss')
    //console.log(hash)
    app.globalData.newArr = newArr

    let allPrice = 0
    let allNum = 0
    newArr.forEach(i => {
      allPrice += i.specifications[0].goods_price * i.num
      allNum += i.num
    })
    console.log(allPrice + '~~~~~~' + allNum)
    this.setData({
      list: newArr,
      allPrice,
      allNum
    })
  },
  getGoods(e){
    let { allPrice, allNum } = e.detail
    console.log(allPrice, allNum)
    this.setData({
      allPrice,
      allNum
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
        app.util.request({
          url: "entry/wxapp/AddGoodsOrder",
          data: {
            openid: d.openid,
            user_id: d.id,
            uniacid: d.uniacid,
            seller_id: data.hotelid,
            price: data.totalPrice,
            type: g.goods_attribute,
            room_num: data.roomNum,
            tel: data.tel,
            orderGoods: [
              {
                spec_id: g.specifications[0].id,
                name: g.goods_name,
                img: g.goods_img,
                type: g.goods_attribute,
                price: data.money,
                number: data.code,
                total_price: data.money * data.code
              }
            ]
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
                  url: `/pages/payComplete/payComplete`
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
  },
  loadData() {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (op) {
    this.loadData();
  }
})