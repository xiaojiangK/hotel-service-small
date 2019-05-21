const api = require("../../utils/api.js");
let latitude = 0;
let longitude = 0;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer: function(newVal, oldVal) {
        if (newVal.coordinates instanceof Array) {
          latitude = Number.parseFloat(newVal.coordinates[0]);
          longitude = Number.parseFloat(newVal.coordinates[1]);
          this.setData({
            data: newVal,
            markers: [{
              iconPath: '/assets/image/index-radius.png',
              id: 0,
              width: 14,
              height: 14,
              latitude,
              longitude
            }]
          });
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: {},
    markers: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openPhoneCall() {
      api.makePhoneCall({
        phoneNumber: this.data.data.link_tel
      })
    },
    openMap() {
      api.openLocation ({
        latitude,
        longitude,
        scale: 18,
        name: this.data.data.name,
        address: this.data.data.address
      })
    }
  }
})
