// components/stepper/stepper.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    getNum:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentNum:1
  },

  methods: {
    /* 点击减号 */
    minus() {
      let num = this.data.currentNum;
      // 如果大于1时，才可以减
      if (num > 1) {
        num --;
      }
      this.setData({
        currentNum: num
      });
      let myEventDetail = this.data.currentNum;
      this.triggerEvent('myevent',myEventDetail,{bubbles:false});//myevent自定义名称事件，父组件中使用
    },
    /* 点击加号 */
    add() {
      let num = this.data.currentNum;
      // 不作过多考虑自增1
      num ++;
      this.setData({
        currentNum: num
      });
      let myEventDetail = this.data.currentNum;
      this.triggerEvent('myevent',myEventDetail,{bubbles:false});//myevent自定义名称事件，父组件中使用
    }
  

  }
})
