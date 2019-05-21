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
    /* 点击减号 */
    minus() {
      var num = this.data.currentNum;
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
      var num = this.data.currentNum;
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
