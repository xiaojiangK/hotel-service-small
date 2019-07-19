// components/index-rim/index-rim.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  data: {
    isGetPhoneNumber:false
  },
  
  
 
  /**
   * 组件的方法列表
   */
  methods: {
    getUserPhoneNumber(e) {
      app.getUserPhoneNumber(e, this);
    }
  }
})
