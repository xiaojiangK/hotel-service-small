var app = getApp();

Page({
  data: {
    //数量
    code: 1,
    goods: {},
    money: 0,
    hotelid: {},
    totalPrice: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.getStorage({
      key: 'hotel',
      success: (res) => {
        this.data.hotelid = res.data.id;
      }
    });
    wx.getStorage({
      key: 'goods',
      success: (res) => {
        this.setData({
          goods: res.data,
          money: res.data.specifications[0].goods_price
        });
        this.count_price()
      }
    });
  },
  pay() {
    wx.showLoading({
      title: '支付中...',
      mask: true
    });
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        const d = res.data;
        const g = this.data.goods;
        app.util.request({
          url: "entry/wxapp/AddGoodsOrder",
          data: {
            openid: d.openid,
            user_id: d.id,
            uniacid: d.uniacid,
            seller_id: this.data.hotelid,
            price: this.data.totalPrice,
            type: g.goods_attribute,
            orderGoods: [
              {
                spec_id: g.specifications[0].id,
                name: g.goods_name,
                img: g.goods_img,
                type: g.goods_attribute,
                price: this.data.money,
                number: this.data.code,
                total_price: this.data.money * this.data.code
              }
            ]
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
          }
        });
      }
    });
  },
  //监听子组件的传值
  onMyevent: function (e) {
    this.setData({ code: e.detail });
    this.count_price()
  },
  /**
   * 计算总价
   */
  count_price() {
    var num = this.data.code  
    var money = this.data.money
    var needPay = num*money
    this.setData({
      totalPrice: needPay
    })
  }
    
})