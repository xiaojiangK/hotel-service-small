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
    url: app.globalData.url
  },
  goCall () {
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    });
  },
  loadData() {
    wx.showNavigationBarLoading();
    wx.getStorage({
      key: 'userinfo',
      success: (res)=>{
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
  }
})