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
        this.setData({ list, isMchid: app.globalData.isMchid });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleToOrder(e) {
      const item = e.currentTarget.dataset.item;
      wx.setStorage({
        key: 'goods',
        data: item
      });
      api.navigateTo({
        url: '/pages/subOrder/subOrder'
      })
    }
  }
})
