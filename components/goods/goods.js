// components/goods/goods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      observer: function(newVal, oldVal) {
        this.setData({ list: newVal });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: []
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
