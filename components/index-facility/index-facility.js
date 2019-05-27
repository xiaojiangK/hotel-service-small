// components/index-facility/index-facility.js
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
            price: Number.isInteger(goods_price) ? Number.parseInt(goods_price) : goods_price.toFixed(2)
          }
        });
        this.setData({ list });
      }
    },
    widget: {
      type: Object,
      observer: function(newVal, oldVal) {
        this.setData({
          style: newVal.style,
          params: newVal.params
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    style: {},
    params: {}
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleFacilityTap(e) {
      wx.navigateTo({
        url: '/pages/hotelFacility/hotelFacility'
      })
    },
    handleToOrder(e) {
      const item = e.currentTarget.dataset.item;
      wx.setStorage({
        key: 'goods',
        data: item
      });
      wx.navigateTo({
        url: '/pages/subOrder/subOrder'
      })
    }
  }
})
