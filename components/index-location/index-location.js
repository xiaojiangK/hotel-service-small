const api = require("../../utils/api.js");
const request = require("../../utils/request.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // title: {
    //   type: String,
    //   value: '太原圣美精品酒店'
    // },
    // meg: {
    //   type: String,
    //   value: '太原迎泽区柳巷南路86号'
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    markers: [{
      iconPath: '/assets/image/index-radius.png',
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 14,
      height: 14
    }],
    phone: '1340000',
    title: '太原圣美精品酒店'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openPhoneCall() {
      api.makePhoneCall({
        phoneNumber: this.data.phone
      })
    },
    openMap() {
      var latitude = 39.924451
      var longitude =116.319454
      api.openLocation ({
        latitude: latitude,
        longitude: longitude,
        address: "大苏打撒旦",
        scale: 18
      })
    }
  }
})
