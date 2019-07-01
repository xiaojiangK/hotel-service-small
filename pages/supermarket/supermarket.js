// pages/supermarket/supermarket.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    selected: [],
    selectType:2, //选择类型
    totalPrice: 0.00, //价格总计
    totalCount: 0, //数量总计
    store:1,
    NoList:false,
    isIphoneX: false,
    isMchid:'',
    allPrice:0.00,
    allNum:0,
    goodTypeList:[
      {
        name:'烟酒',
        type:1,
        typeNum:0
      },
      {
        name: '零食',
        type: 2,
        typeNum: 0
      },
      {
        name: '特产',
        type: 3,
        typeNum: 0
      },
    ],
    isshowGoods:false,//是否显示商品详情
    currentGoods:null,
  },
  loadData() {
    let _this = this
    let isIphoneX =app.globalData.isIphoneX;
    if (isIphoneX){
      this.setData({
        isIphoneX: isIphoneX
      })
    }
    // 酒店超市
    wx.showLoading({
      title: '加载中...',
    })
    wx.getStorage({
      key: 'hotel',
      success: (res) => {
        let {store} = res.data || 1
        _this.setData({
          store: store
        })
        app.util.request({
          url: "entry/wxapp/Goods",
          data: {
            seller_id: res.data.id
          },
          success:(res) => {
            let oldList = res.data;
            const list = oldList.map(item => {
              const goods_price = Number.parseFloat(item.specifications[0].goods_price);
              return {
                ...item,
                isSelected:false,
                goods_img: item.goods_img + app.globalData.imgSize,
                price: Number.isInteger(goods_price) ? Number.parseInt(goods_price) : goods_price.toFixed(2)
              }
            });
            let newGoodsList = list.map(item => {
              return {
                ...item,
                goodsType: 2
              }
            })
            list.isMchid = app.globalData.isMchid
            this.setData({ list: newGoodsList, isMchid: app.globalData.isMchid });
            app.globalData.shopCar = newGoodsList
            wx.hideLoading();
            // if (list.length == 0){
            //   this.setData({ NoList:true });
            // }
          }
        });
      }
    });
   
  },
  getEmitData(e){
    let { totalPrice, totalCount } = e.detail
    this.setData({
      totalPrice,
      totalCount
    })
  },
  selected(){
    let totalCount = this.data.totalCount
    if(totalCount <= 0) {
      wx.showToast({
        icon: "none",
        image: "/assets/image/icon-warn.png",
        title: '未选择任何商品'
      })
      return;
    }else {
      wx.navigateTo({
        url: '/pages/marketPay/marketPay',
      })
    }
    
  },

  //选择不同的种类
  selectGoodsClass(e){
    let goodsClass = e.currentTarget.dataset.goodtype
    let current = goodsClass.type
    this.setData({
      selectType: current
    })
  },
  //查看商品详情
  showGoods(e){
    let goods = e.currentTarget.dataset.goods
    let isShowJoincar =  goods.num? false:true
    this.setData({
      isshowGoods:true,
      currentGoods:goods,
      isShowJoincar: isShowJoincar
    })
  },
  // 关闭商品详情
  closeGoods(){
    this.setData({
      isshowGoods: false
    })
  },
  showmore(){
    console.log('1')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.loadData();
  },
  onShow(){
    let totalPrice = 0
    let totalCount = 0
    let currentList = app.globalData.shopCar
    if (currentList && currentList.length>0){
      currentList.forEach(i => {
        let goodsNum = i.num || 0
        totalPrice += i.specifications[0].goods_price * goodsNum
        totalCount += goodsNum
      })
    }
    totalPrice = totalPrice.toFixed(2)
    this.setData({
      totalPrice,
      totalCount
    })
  },


  /* 点击加减 */
  calculation(e) {
    let getDataSet = e.currentTarget.dataset
    //let newList = app.globalData.shopCar
    let ctype = getDataSet.ctype
    let goodsItem = getDataSet.goods
    let goodsId = goodsItem.goods_id
    let goodsType = goodsItem.goodsType
    
    if (app.globalData.shopCar.length > 0) {
      let c = app.globalData.shopCar.find(item => {
        return item.goods_id == goodsId
      })
      if (c.num) {
        if (ctype == 'add'){
          c.num++
          wx.showToast({
            title: '已加入',
          })
        }else{
          c.num--
        }
      } else {
        c.num = 1
        wx.showToast({
          title: '已加入',
        })
      }
      c.num > 0 ? c.isSelected = true : c.isSelected = false

      //弹窗中的加减
      if (this.data.currentGoods&&this.data.currentGoods.num){
        ctype == 'add' ? this.data.currentGoods.num++ : this.data.currentGoods.num--
        let isShowJoincar =  this.data.currentGoods.num>0? false : true
        this.setData({
          currentGoods: this.data.currentGoods,
          isShowJoincar: isShowJoincar
        }) 
      } else if (this.data.currentGoods){
        this.data.currentGoods.num = 1
        this.setData({
          currentGoods: this.data.currentGoods,
          isShowJoincar: false
        }) 
      }
      
    }

    let currentGoodsType = this.data.goodTypeList.find(item => {
      return item.type == goodsType
    })
    ctype == 'add' ? currentGoodsType.typeNum++ : currentGoodsType.typeNum--

    this.setData({
      list: app.globalData.shopCar,
      goodTypeList: this.data.goodTypeList
    })
    // let allGoods = app.globalData.newArr
    // let cIndex = allGoods.findIndex((c, i) => c.goods_id == goodsId)
    // allGoods[cIndex].num++
    // this.setData({
    //   list: allGoods
    // })
    let allPrice = 0
    let allNum = 0
    app.globalData.shopCar.forEach(i => {
      if (i.num) {
        allPrice += i.specifications[0].goods_price * i.num
        allNum += i.num
      }
      
    })
    allPrice = allPrice.toFixed(2)
    this.setData({
      totalPrice: allPrice,
      totalCount:allNum
    })
  },

  onShareAppMessage: function () {
  }

})