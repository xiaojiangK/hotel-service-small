const api = require("../../utils/api.js");
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      observer: function(newVal, oldVal) {
        const list = newVal.map(item => {
          const goods_price = Number.parseFloat(item.specifications[0].goods_price);
          return {
            ...item,
            goods_img: item.goods_img + app.globalData.imgSize,
            price: Number.isInteger(goods_price) ? Number.parseInt(goods_price) : goods_price.toFixed(2)
          }
        });
        let config = app.globalData.hotelConfig
        if (list.length > 0 && config.wx_mchid && config.breakfast_swich == 1){
          this.setData({ list, hasBreatfast: true, noBreatfast:false });
        }else{
          this.setData({ noBreatfast: true });
        }
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    hasBreakfast:false,
    noBreakfast: false
  },
  lifetimes:{
    ready(){
      let _this = this 
      wx.getStorage({
        key: 'hotel',
        success: function(res) {
          let { breakfast_ticket } = res.data || 1
          _this.setData({
            isShow: breakfast_ticket
          })
        },
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleToOrder(e) {
      const item = e.currentTarget.dataset.item;
      wx.getStorage({
        key: 'userinfo',
        success: (res) => {
          if (!res.data.tel) {
            wx.navigateTo({
              url: '/pages/getPhone/getPhone',
            })
          }else{
            wx.setStorage({
              key: 'goods',
              data: item
            });
            api.navigateTo({
              url: '/pages/subOrder/subOrder'
            })
          }
        },
        fail: () => {
          this.setData({
            isGetUserInfo: true
          });
        }
      });
    }
  }
})
