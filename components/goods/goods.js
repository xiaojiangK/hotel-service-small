// components/goods/goods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isCurrentNum:{
      type: Number
    },
    isCar: {
      type: Number
    },
    isStepper: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isStepper: false,
    isCurrentNum:false,
    isCar:false
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
