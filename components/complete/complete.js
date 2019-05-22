// components/complete/complete.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    paramToCom: {
      type: Object,
      observer: function(newVal, oldVal) {
        this.setData({ param: newVal  });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    param: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
