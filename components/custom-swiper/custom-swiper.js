var app =  getApp();

Component({
  properties: {
    data: {
      type: Object,
      observer: function(newVal, oldVal) {
        this.setData({ data: newVal  });
      }
    },
    widget: {
      type: Object,
      observer: function(newVal, oldVal) {
        this.setData({
          style: newVal.style
        });
      }
    }
  },

  data: {
    data: {},
    indicatorDots: false,
    interval: 3000,
    duration: 1000,
    style: {}
  },

  methods: {

  }
})
