
Page({
  data: {
    //数量
    code: 1,
    money: 22,
    totalPrice: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.count_price()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  //监听子组件的传值
  onMyevent: function (e) {
    var code = e.detail
    this.setData({
      code: code
    })
    this.count_price()
  },
  /**
   * 计算总价
   */
  count_price() {
    var num = this.data.code  
    var money = this.data.money
    var needPay = num*money
    this.setData({
      totalPrice: needPay
    })
  }
    
})