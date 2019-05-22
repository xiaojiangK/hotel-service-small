// components/orderItem/orderItem.js
import { resetTime } from '../../utils/common.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(newVal, oldVal) {
        this.setData({ data: newVal });
      }
    }
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() { 
      this.startCountDown()
    },
    moved() { },
    detached() { },
  },
  /**
   * 组件的初始数据
   */
  data: {
    remainTime:''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    startCountDown(){
      resetTime(130,this)
    }
  }
})
