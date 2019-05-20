//app.js
App({
  onLaunch () {
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
                          this.globalData.userInfo.openid = res4.data.openid;
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
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
            }
          })
        }
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
    userInfo: null,
    url: 'http://msp.showboom.cn/attachment/'
  }
})