// components/index-facility/index-facility.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      observer: function(newVal, oldVal) {
        this.setData({ list: newVal  });
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
    handleFacilityTap(e) {
      wx.navigateTo({
        url: '/pages/hotelFacility/hotelFacility'
      })
    },
    handleToOrder(e) {
      const item = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: `/pages/subOrder/subOrder?name=${item.goods_name}&price=${item.specifications[0].goods_price}`
      })
    }
  }
})
