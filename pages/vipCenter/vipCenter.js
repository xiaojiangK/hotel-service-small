// pages/vipCenter/vipCenter.js
var app = getApp();
import { formatDate } from '../../utils/tool.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    userInfo: {},
    orderList: [],
    hotelName: '',
    tel: 13800138000,
    isVerify: 0,
    isGetPhoneNumber: false,
    user: {}
  },
  goCall () {
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    });
  },
  //领取会员
  getVip(){
    // 是否需要手机号授权
    let userInfo = wx.getStorageSync('userinfo')
    if (!userInfo.tel) {
      wx.navigateTo({
        url: '/pages/getPhone/getPhone',
      })
      return
    }
  },
  verifygoods(e) {
    // 允许从相机和相册扫码
    wx.scanCode({
      success (data) {
        wx.getStorage({
          key: 'userinfo',
          success: (res) => {
            const d = res.data;
            wx.showModal({
              title: '提示',
              content: '确认使用后，该券将失效',
              cancelText: '取消',
              confirmText: '确定',
              success: (e) => {
                if (e.confirm) {
                  app.util.request({
                    url: "entry/wxapp/Verifygoods",
                    data: {
                      openid: d.openid,
                      uniacid: d.uniacid,
                      orderid: data.result
                    },
                    success:(res) => {
                      if (res.data.status == 200) {
                        wx.showToast({
                          title: '核销成功',
                          icon: 'none'
                        });
                      } else {
                        wx.showToast({
                          title: res.data.info,
                          icon: 'none'
                        });
                      }
                    }
                  });
                }
              }
            });
          },
          fail: () => {
            wx.getUserInfo({
              success: (res) => {
                app.userLogin(res);
              }
            });
          }
        });
      }
    });
  },
  loadData() {
    let that = this 
    wx.showNavigationBarLoading();
    wx.getStorage({
      key: 'userinfo',
      success: (res)=>{
        that.setData({
          userInfo:res.data
        })
        app.getUserLevel(this);
        // 判断是否有核销权限
        app.util.request({
          url: "entry/wxapp/Write_off",
          data: {
            openid: res.data.openid,
            uniacid: res.data.uniacid
          },
          success: (res) => {
            if (res.data.code == 200){
              this.setData({
                isVerify: res.data.code
              });
            }
          }
        });

        this.setData({ userInfo: res.data });
        app.util.request({
          url: "entry/wxapp/MyOrder",
          data: {
            uniacid: res.data.uniacid,
            user_id: res.data.id,
            page: this.data.page
          },
          success:(res) => {
            const orderList = res.data.map(item => {
              // 大于下单时间半个小时，则取消订单
              if (item.status == 1) {
                if (Date.now() - item.create_time * 1000 > (60 * 30 * 1000)) {
                  item.status = 3;
                  app.util.request({
                    url: "entry/wxapp/CancelOrder",
                    data: {
                      flag: item.flag,
                      order_id: item.id
                    }
                  });
                }
              }
              let totalNum = 0;
              if (item.goods_info) {
                for (let i of item.goods_info) {
                  totalNum += Number.parseInt(i.number);
                }
              } else {
                totalNum = item.num;
              }
              return {
                ...item,
                totalNum,
                arrival_time: formatDate(item.arrival_time * 1000),
                departure_time: formatDate(item.departure_time * 1000)
              }
            });
            this.setData({ orderList });
            wx.hideLoading();
            wx.hideNavigationBarLoading();
          }
        });
      }
    });
    wx.getStorage({
      key: 'hotel',
      success: (res)=>{
        const data = res.data;
        this.setData({
          tel: data.tel,
          hotelName: data.name
        });
      }
    });
  },
  goDetail(e) {
    const item = e.currentTarget.dataset.item;
    if (item.flag == '0') {
      wx.navigateTo({
        url: `/pages/hotelOrderDetail/hotelOrderDetail?id=${item.id}&flag=${item.flag}`
      });
    } else if (item.flag == '1') {
      wx.navigateTo({
        url: `/pages/marketOrder/marketOrder?id=${item.id}&flag=${item.flag}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/serviceOrderDetail/serviceOrderDetail?id=${item.id}&flag=${item.flag}&source=order`
      });
    }
  },
  onPullDownRefresh() {
    this.loadData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.loadData();
    this.setData({
      isGetUserInfo: false
    });
  },
  onHide() {
    this.setData({
      isGetUserInfo: false
    });
  },
  getUserPhoneNumber(e) {
    app.getUserPhoneNumber(e, this);
  },
  closeAlert() {
    this.setData({
      isGetUserInfo: false
    });
  },
  getSetting() {
    wx.getSetting({
      success: (res)=>{
        if (!res.authSetting['scope.userInfo']) {
          this.setData({
            isGetUserInfo: true
          });
        }
      }
    });
  },
  getUserInfo(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.getUserInfo({
        success: (res) => {
          wx.setStorage({
            key: 'user',
            data: res
          });
          app.userLogin(res, this);
          app.getUserLevel(this);
        }
      });
    }
  },
  // getSignTotal(openid, name) {
  //   const a = wx.getAccountInfoSync() ? wx.getAccountInfoSync() : {}
  //   if (openid == 'undefined') {
  //     wx.login({
  //       success: res1 => {
  //         app.util.request({
  //           url: "entry/wxapp/Openid",
  //           data: {
  //             code: res1.code
  //           },
  //           success: (res2) => {
  //             openid = res2.data.openid
  //           }
  //         });
  //       }
  //     });
  //   }
  //   wx.request({
  //     url: 'https://j.showboom.cn/app/index.php?i=4&t=1&v=1.0.0&from=wxapp&c=entry&a=wxapp&do=wxUserAccessLog&m=zh_jdgjb',
  //     method: 'POST',
  //     data: {
  //       access_type: 'index',
  //       access_page: 'index',
  //       sourcefrom: "hotelmp",
  //       wx_nick_name: name,
  //       wxopenid: openid,
  //       app_id: a.miniProgram.appId
  //     },
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     success: function (res) {
  //       console.log(res)
  //     }
  //   })
  // },
  onShareAppMessage: function () {
  }
})
