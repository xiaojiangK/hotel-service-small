// pages/supermarket/supermarket.js
var app = getApp();
let sellerId = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    selected: [],
    selectType: -1, //选择类型
    selectTypeId:-1,
    totalPrice: 0.00, //价格总计
    totalCount: 0, //数量总计
    store:1,
    noList:false,
    hasList:false,
    isIphoneX: false,
    isMchid:'',
    goodTypeList: [{
      id: -1,
      seller_id: 0,
      uniacid: 0,
      sort: 0,
      name: "全部",
      status: 1,
      addtime: "",
      typeNum: -1,
      type: -1,
      classTypeTotal: 0
}],
    isshowGoods:false,//是否显示商品详情
    currentGoods:null,
    isShowShopcar:false,
    shopcarList:[]
    // isClickScroll: false
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
        let {store} = res.data || 1;
        sellerId = res.data.id;
        _this.setData({
          store: store
        })
        // 获取分类
        app.util.request({
          url: "entry/wxapp/Classify",
          success: (res) => {

            let list = res.data.map((item, index) => {
              return {
                ...item,
                typeNum: 0,
                type: index
              }
            });
            let goodTypeList= this.data.goodTypeList.concat(list)
            if (this.data.goodTypeList[0]) {
              this.getGoods();
            }

            this.setData({ goodTypeList });

          }
        });
      }
    });
  },
  // 获取商品
  getGoods(classId = '') {
    app.util.request({
      url: "entry/wxapp/Goods",
      data: {
        seller_id: sellerId,
        class: ''
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
        // let newGoodsList = list.map(item => {
        //   return {
        //     ...item
        //   }
        // })
        let newGoodsList = list
        let goodTypeList =  this.data.goodTypeList.map(item => {
          let a = list.filter(i => {
            return i.cid == item.id
          })
          return {
            ...item,
            classTypeTotal:a.length*50
          }
        })
        let config = app.globalData.hotelConfig
        if (list.length > 0 && config.wx_mchid && config.store_swich == 1) {
          this.setData({ list: newGoodsList, goodTypeList: goodTypeList, isMchid: app.globalData.isMchid, hasList: true });
        }else{
          this.setData({ noList: true });
        }
        // list.isMchid = app.globalData.isMchid
        
        app.globalData.shopCar = newGoodsList
        wx.hideLoading();
        // if (list.length == 0){
        //   this.setData({ noList: true, hasList:false });
        // }
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
    let goodsClass = e.currentTarget.dataset.goodtype;
    let current = goodsClass.type;
    let classId = goodsClass.id;
    let index = e.currentTarget.dataset.index // 元素索引
    // let scrollTop = 0 //滚动距离
    // this.getGoods(classId);
    // let i = 0
    if (classId != -1){
      let classList = app.globalData.shopCar.filter(item => {
        return item.cid == classId
      })

      this.setData({
        list: classList,
        selectType: current,
        isClickScroll: true,
        selectTypeId: classId
      })
    } else{
      this.setData({
        list: app.globalData.shopCar,
        selectType: current,
        isClickScroll: true,
        selectTypeId: -1
      })
    }
    
    
    // if (index == 0){
    //   scrollTop =0
    // }else{
    //   for (let i = 0; i<index; i++ ){
    //     scrollTop += this.data.goodTypeList[i].classTypeTotal
    //   }
    // }
    // wx.pageScrollTo({
    //   scrollTop: scrollTop,
    //   duration: 300
    // })
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
  
  //滚动商品
  onPageScroll(ev){
    // if(this.data.isClickScroll) return
    // let scrolltop = ev.scrollTop
    // let len = this.data.goodTypeList.length
    // if(len>0){
    //   let top = 0
    //   for (let i = 0; i < len; i++){
    //     top += this.data.goodTypeList[i].classTypeTotal
    //     if (top > scrolltop){
    //       this.setData({
    //         selectType: i
    //       })
    //       console.log(this.data.goodTypeList[i].id)
    //       // this.data.goodTypeList[i]
    //       break
    //     }
    //   }
    // }
  },

  //显示购物车
  showShopcar(){
    // let shopcarArr = this.data.list.filter(item => {
    //   return item.num && item.num > 0
    // })
    this.setData({
      isShowShopcar:true,
      // shopcarList: shopcarArr
    })
  },
  closeShopcar() {
    this.setData({
      isShowShopcar: false
    })
    
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

  // 清空购物车
  clearShopcar(){
    let a = app.globalData.shopCar.map(item => {
      item.num = 0
      return item
    })

    let b = this.data.goodTypeList.map(item => {
      item.typeNum = 0
      return item
    })

    // 不同分类时展示列表不同
    if (this.data.selectTypeId != -1) {
      let classList = a.filter(item => {
        return item.cid == this.data.selectTypeId
      })

      this.setData({
        list: classList,
        shopcarList: [],
        goodTypeList: b,
        totalPrice: 0.00,
        totalCount: 0,
        isShowShopcar: false,
      })
    } else {
      this.setData({
        list: a,
        shopcarList: [],
        goodTypeList: b,
        totalPrice: 0.00,
        totalCount: 0,
        isShowShopcar: false,
      })
    }
    

    // this.shopcarList = []
  },
  /* 点击加减 */
  calculation(e) {
    // 是否需要手机号授权
    let userInfo = wx.getStorageSync('userinfo')
    if (!userInfo.tel){
      wx.navigateTo({
        url: '/pages/getPhone/getPhone',
      })
      return
    }


    let getDataSet = e.currentTarget.dataset
    //let newList = app.globalData.shopCar
    let ctype = getDataSet.ctype
    let goodsItem = getDataSet.goods
    let goodsId = goodsItem.goods_id
    let goodsType = goodsItem.cid
    
    if (app.globalData.shopCar.length > 0) {
      let c = app.globalData.shopCar.find(item => {
        return item.goods_id == goodsId
      })
      if (c.num) {
        if (ctype == 'add'){
          c.num++
          wx.showToast({
            icon:'none',
            title: '商品添加成功'
          })
        }else{
          c.num--
        }
      } else {
        c.num = 1
        wx.showToast({
          icon:'none',
          title: '商品添加成功',
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
      return item.id == goodsType
    })
    ctype == 'add' ? currentGoodsType.typeNum++ : currentGoodsType.typeNum--

    let shopcarArr = app.globalData.shopCar.filter(item => {
      return item.num && item.num > 0
    })
    this.setData({
      list: app.globalData.shopCar,
      goodTypeList: this.data.goodTypeList,
      shopcarList: shopcarArr
    })

    // 不同分类时展示列表不同
    if (this.data.selectTypeId != -1) {
      let classList = app.globalData.shopCar.filter(item => {
        return item.cid == this.data.selectTypeId
      })

      this.setData({
        list: classList,
        goodTypeList: this.data.goodTypeList,
        shopcarList: shopcarArr
      })
    } else {
      this.setData({
        list: app.globalData.shopCar,
        goodTypeList: this.data.goodTypeList,
        shopcarList: shopcarArr
      })
    }
    // let allGoods = app.globalData.newArr
    // let cIndex = allGoods.findIndex((c, i) => c.goods_id == goodsId)
    // allGoods[cIndex].num++
    // this.setData({
    //   list: allGoods
    // })

    // 价格数量计算
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
      totalCount: allNum
    })
  },

  onShareAppMessage: function () {
  }

})