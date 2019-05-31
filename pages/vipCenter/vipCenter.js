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
    url: app.globalData.url,
    isVerify: 0
  },
  goCall () {
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    });
  },
  verifygoods() {
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
            app.userLogin();
          }
        });
      }
    });
  },
  loadData() {
    wx.showNavigationBarLoading();
    wx.getStorage({
      key: 'userinfo',
      success: (res)=>{
        
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
  },
  onShareAppMessage: function (res) {
  }
})
