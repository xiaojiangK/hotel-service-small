var app = getApp();

Page({
  data: {
    //数量
    code: 1,
    goods: {},
    money: 0,
    phone: '',
    hotelid: {},
    totalPrice: "",
    isBreakfast: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        this.setData({
          phone: res.data.tel
        });
      }
    });
    wx.getStorage({
      key: 'hotel',
      success: (res) => {
        this.data.hotelid = res.data.id;
      }
    });
    wx.getStorage({
      key: 'goods',
      success: (res) => {
        if (res.data.goods_attribute == '3') {
          this.setData({
            isBreakfast: true
          });
        }
        this.setData({
          goods: res.data,
          money: res.data.price
        });
        this.count_price()
      }
    });
  },
  telChange(e){
    this.data.phone = e.detail.value
  },
  pay() {
    if (this.data.phone.length < 11) {
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
        const g = this.data.goods;
        app.util.request({
          url: "entry/wxapp/AddGoodsOrder",
          data: {
            phone: this.data.phone,
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