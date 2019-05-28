//app.js
var Moment = require("./utils/moment.js");

App({
  onLaunch (option) {
    // 存入参数
    if (option.query.order && option.query.flag) {
      this.globalData.scene = [option.query.order, option.query.flag];
    }
    // 设缓存缓存起来的日期
    wx.setStorage({
      key: 'ROOM_SOURCE_DATE',
      data: {
        checkInDate: Moment(new Date()).format('YYYY-MM-DD'),
        checkOutDate: Moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
      }
    });
  },
  userLogin() {
    // 登录
    wx.login({
      success: res1 => {
        this.util.request({
          url: "entry/wxapp/Openid",
          data: {
            code: res1.code
          },
          success:(res2) => {
            wx.getSetting({
              success:(res) => {
                if (res.authSetting["scope.userInfo"]){
                  wx.getUserInfo({
                    success:(res3) => {
                      this.util.request({
                        url: "entry/wxapp/login",
                        data: {
                          openid: res2.data.openid,
                          img: res3.userInfo.avatarUrl,
                          name: res3.userInfo.nickName
                        },
                        success:(res4) => {
                          wx.setStorage({
                            key: 'userinfo',
                            data: res4.data
                          });
                        }
                      });
                    }
                  })
                }
              }
            });
          }
        });
      }
    });
  },
  getUserPhoneNumber(e){
    const d = e.detail;
    if(e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: res => {
          wx.getStorage({
            key: 'userinfo',
            success: (res2) => {
              this.util.request({
                url: "entry/wxapp/Jiemi",
                data: {
                  iv: d.iv,
                  code: res.code,
                  data: d.encryptedData,
                  openid: res2.data.openid
                },
                success:(res3) => {
                  if (res3.data.status == 200) {
                    wx.showToast({
                      title: '绑定成功',
                      icon: 'none'
                    });
                  } else {
                    wx.showToast({
                      title: res3.data.info,
                      icon: 'none'
                    });
                  }
                }
              });
            }
          });
        }
      });
    }
  },
  // 订单去支付
  goPay(id, flag) {
    wx.showLoading({
      title: '支付中...',
      mask: true
    });
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        this.util.request({
          url: "entry/wxapp/Pay",
          data: {
            flag: flag,
            order_id: id,
            openid: res.data.openid
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
  // 小写转大写
  integer(num) {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = (temp) => {
        let strArr = temp.toString().split("").reverse();
        let newNum = "";
        for (var i = 0; i < strArr.length; i++) {
            newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
        }
        return newNum;
    }
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) noWan = "0" + noWan;
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
  },
  util: require("utils/util.js"),
  globalData: {
    url: 'http://msp.showboom.cn/attachment/',
    shopCar:[],
    newArr:[],
    scene: null
  },
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  }
})