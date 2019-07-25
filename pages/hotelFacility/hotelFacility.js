// pages/hotelFacility/hotelFacility.js
var app = getApp();
const api = require("../../utils/api.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    facility:1,
    isHasList:false,
    isNoList: false
  },
  loadData() {
    // 酒店设施
    wx.getStorage({
      key: 'hotel',
      success: (res) => {
        let { facility } = res.data
        this.setData({
          facility: facility
        })
        app.util.request({
          url: "entry/wxapp/Volume",
          data: {
            seller_id: res.data.id
          },
          success:(res) => {
            const list = res.data.map(item => {
              const goods_price = Number.parseFloat(item.specifications[0].goods_price);
              return {
                ...item,
                goods_img: item.goods_img + app.globalData.imgSize,
                price: Number.isInteger(goods_price) ? Number.parseInt(goods_price) : goods_price.toFixed(2)
              }
            });
            if (facility == 1 && list.length > 0){
              this.setData({ list, isMchid: app.globalData.isMchid, isHasList: true });
            }else{
              this.setData({ list, isMchid: app.globalData.isMchid, isNoList: true });
            }
            
            // this.setData({ list: res.data });
          }
        });
      }
    });
  },
  handleToOrder(e) {
    const item = e.currentTarget.dataset.item;
    wx.setStorage({
      key: 'goods',
      data: item
    });
    api.navigateTo({
      url: '/pages/subOrder/subOrder'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadData();
  },
  onShareAppMessage: function () {
  }
})