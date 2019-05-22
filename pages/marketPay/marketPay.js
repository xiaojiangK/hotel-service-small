// pages/marketPay/marketPay.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    allNum:0,
    allPrice:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.shopCar)
    let hash = {}
    let newArr = []
    newArr = app.globalData.shopCar.reduce((pre,item)=>{
      if (hash[item.goods_id]){
         let a =  pre.find(c => c.goods_id == item.goods_id)
        a.num+=1
        hash[item.goods_id] += 1
        item.num += 1
      }else{
        hash[item.goods_id] = 1
        item.num=1
        pre.push(item)
      }
      return pre                            
    },[])
    console.log(newArr)
    //console.log(hash)
    app.globalData.newArr = newArr

    let allPrice = 0
    let allNum = 0
    newArr.forEach(i => {
      allPrice += i.specifications[0].goods_price * i.num
      allNum += i.num
    })
    console.log(allPrice + '~~~~~~' + allNum)
    this.setData({
      list: newArr,
      allPrice,
      allNum
    }, [])
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getGoods(e){
    let { allPrice, allNum } = e.detail
    console.log(allPrice, allNum)
    this.setData({
      allPrice,
      allNum
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})