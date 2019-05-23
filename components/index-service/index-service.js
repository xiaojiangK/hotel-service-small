// components/index-service/index-service.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    service: {
      type: Array,
      value: [{
          navigator: '../morningVolume/morningVolume',
          url: '/assets/image/index-volume.png',
          text: '早餐券',
        }, {
          navigator: '../supermarket/supermarket',
          url: '/assets/image/index-supermarket.png',
          text: '酒店超市',
        }, {
          navigator: '../hotelFacility/hotelFacility',
          url: '/assets/image/index-facility.png',
          text: '酒店设施',
        }, {
          navigator: '../hotelRim/hotelRim',
          url: '/assets/image/index-periphery.png',
          text: '酒店周边',
        }
      ] 
    }
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

  }
})
