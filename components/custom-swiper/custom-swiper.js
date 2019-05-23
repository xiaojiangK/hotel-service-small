var app =  getApp();

Component({
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    data: {
      type: Object,
      observer: function(newVal, oldVal) {
        this.setData({ data: newVal  });
      }
    },
    widget: {
      type: Object,
      observer: function(newVal, oldVal) {
        this.setData({
          style: newVal.style
        });
      }
    }
  },

  /**
   * 组件的初始数据
   * 可用于模版渲染
   */
  data: {
    data: {},
    indicatorDots: false,
    interval: 2000,
    duration: 1000,
    style: {}
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {

  }
})
