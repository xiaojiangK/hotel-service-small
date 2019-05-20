const api = require("../../utils/api.js");
const request = require("../../utils/request.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleToOrder() {
      api.navigateTo({
        url: '../../pages/subOrder/subOrder'
      })
    }
  }
})
