var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goods: {
      type: Array,
      observer: function(newVal, oldVal) {
        const list = newVal.map(item => {
          return {
            ...item,
            goods_img: app.globalData.url + item.goods_img
          }
        });
        this.setData({ list });
      }
    },
    info: {
      type: Array,
      observer: function(newVal, oldVal) {
        this.setData({ info: newVal });
      }
    },
    isCurrentNum:{
      type: Number
    },
    isCar: {
      type: Number
    },
    isStepper: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    info: [],
    isStepper: false,
    isCurrentNum:false,
    isCar:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    delete(e) {
      const list = this.data.list.filter(item => {
        return item.goods_id != e.currentTarget.dataset.id;
      });
      this.setData({ list });
    }
  }
})
