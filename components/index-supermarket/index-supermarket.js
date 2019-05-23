// components/index-supermarket/index-supermarket.js
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
    goGoods() {
      wx.navigateTo({
        url: '/pages/supermarket/supermarket'
      })
    }
  }
})
