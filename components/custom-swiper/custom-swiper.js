const api = require("../../utils/api.js");
const request = require("../../utils/request.js");

Component({
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    swiperData: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   * 可用于模版渲染
   */
  data: {
    indicatorDots: false,
    interval: 2000,
    duration: 1000,
    textTp: 'Hello 你好',
    textBt: '欢迎入住太原圣美精品酒店'
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {

  }
})
