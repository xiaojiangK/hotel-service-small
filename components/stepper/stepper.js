// components/stepper/stepper.js
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
    currentNum:1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    minus(){
      let num = this.data.currentNum
      if (num>1){
        num--
      }
      this.setData({
        currentNum: num
      })
    },
    add() {
      let num = this.data.currentNum
      num++
      this.setData({
        currentNum: num
      })
    }
  }
})
