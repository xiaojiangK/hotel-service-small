// components/goods/goods.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      observer: function(newVal, oldVal) {
        const list = newVal.map(item => {
          const goods_price = Number.parseFloat(item.specifications[0].goods_price);
          return {
            ...item,
            goods_img: item.goods_img + app.globalData.imgSize,
            price: Number.isInteger(goods_price) ? Number.parseInt(goods_price) : goods_price.toFixed(2)
          }
        });
        list.isMchid = app.globalData.isMchid
        this.setData({ list, isMchid:app.globalData.isMchid });
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
    isStepper: false,
    isCurrentNum:false,
    isCar:false,
    totalPrice:0,
    totalCount:0,
    isMchid:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    delete(e) {
      let goodsId = e.currentTarget.dataset.gid
      let allGoods = app.globalData.newArr
      const list = allGoods.filter(item => {
        return item.goods_id != goodsId
      });
      app.globalData.newArr = list
      this.setData({
        list
      })
      let allPrice = 0
      let allNum = 0
      list.forEach(i => {
        allPrice += i.specifications[0].goods_price * i.num
        allNum += i.num
      })
      this.triggerEvent('myevent', { allPrice, allNum }, { bubbles: false });
    },
    addShopCar(e){
      let goodsItem = e.currentTarget.dataset.goods
      let goodId = goodsItem.goods_id
      let totalCount = 0
      let totalPrice = 0

      let hash = {}
      //let newArr = []
      let flag = false

      
      if (app.globalData.newArr.length>0){
        //let flag = false
        let c = app.globalData.newArr.find(item => { 
          return item.goods_id == goodId
          })
         
        if(c){
          c.num++
        }else{
          goodsItem.num = 1
          app.globalData.newArr.push(goodsItem)
        }
      }else{
        goodsItem.num = 1
        app.globalData.newArr.push(goodsItem)
      }
      console.log(app.globalData.newArr)
      let newArr = app.globalData.newArr
      newArr.forEach(i => {
        totalPrice += i.specifications[0].goods_price * i.num
        totalCount += i.num
      })
      totalPrice = totalPrice.toFixed(2)
      this.setData({ totalPrice, totalCount })




      this.triggerEvent('emitData', { totalPrice,totalCount }, { bubbles: false })
    },
    /* 点击减号 */
    minus(e) {
      let goodsId = e.currentTarget.dataset.gid
      let allGoods = app.globalData.newArr
      let cIndex = allGoods.findIndex( (c,i)=> c.goods_id == goodsId)
      if (allGoods[cIndex].num>1){
        allGoods[cIndex].num--
      }
      this.setData({
        list: allGoods
      })
      let allPrice = 0
      let allNum = 0
      allGoods.forEach(i => {
        allPrice+=i.specifications[0].goods_price * i.num
        allNum += i.num
      })
      allPrice = allPrice.toFixed(2)
      this.triggerEvent('myevent', { allPrice, allNum}, { bubbles: false });
    },

    /* 点击加号 */
    add(e) {
      let goodsId = e.currentTarget.dataset.gid
      let allGoods = app.globalData.newArr
      let cIndex = allGoods.findIndex((c, i) => c.goods_id == goodsId)
      allGoods[cIndex].num++
      this.setData({
        list: allGoods
      })
      let allPrice = 0
      let allNum = 0
      allGoods.forEach(i => {
        allPrice += i.specifications[0].goods_price * i.num
        allNum += i.num
      })
      allPrice = allPrice.toFixed(2)
      this.triggerEvent('myevent', { allPrice, allNum }, { bubbles: false });
    }

  }
})
