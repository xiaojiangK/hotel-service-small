// components/index-rim/index-rim.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      observer: function(newVal, oldVal) {
        const list = newVal.map(item => {
          return {
            ...item,
            img: item.img + app.globalData.imgSize,
          }
        });
        this.setData({ list  });
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
