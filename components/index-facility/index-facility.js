// components/index-facility/index-facility.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bannerUrl: {
      type: String,
      value: 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640'
    },
    title: {
      type: String,
      value: '畅游蓝海游泳池（单人票价）'
    },
    meg: {
      type: String,
      value: '入住豪华双人房间及以上可免费试用'
    },
    number: {
      type: Number,
      value: 44
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
    handleFacilityTap(e) {
      wx.navigateTo({
        url: '/pages/hotelFacility/hotelFacility'
      })
    }
  }
})
