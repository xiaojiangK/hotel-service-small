// components/index-rim/index-rim.js
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
    handleRimTap(e) {
      wx.navigateTo({
        url: '/pages/hotelRim/hotelRim'
      })
    },
    goCall(e) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel
      });
    }
  }
})
