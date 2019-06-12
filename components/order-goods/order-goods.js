var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      observer: function(newVal, oldVal) {
        const goods = newVal.map(item => {
          const price = Number.parseFloat(item.price);
          return {
            ...item,
            img: item.img + app.globalData.imgSize,
            price: Number.isInteger(price) ? Number.parseInt(price) : price.toFixed(2)
          }
        });
        this.setData({ goods });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goods: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
