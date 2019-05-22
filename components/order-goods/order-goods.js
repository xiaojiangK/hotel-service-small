var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      observer: function(newVal, oldVal) {
        this.setData({ goods: newVal });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goods: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
