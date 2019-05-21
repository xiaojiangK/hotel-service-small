// pages/serviceOrderDetail/serviceOrderDetail.js
var app = getApp();
import { formatDate } from '../../utils/tool.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: []
  },
  loadData(op) {
    app.util.request({
      url: "entry/wxapp/orderdetails",
      data: {
        flag: op.flag,
        order_id: op.id
      },
      success:(res) => {
        const data = res.data;
        const g = data.goods[0];
        this.setData({
          orderInfo: {
            ...data,
            finish_time: formatDate(data.finish_time * 1000),
            goods: [{
              name: g.goods_name,
              img: app.globalData.url + g.goods_img
            }]
          } 
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (op) {
    this.loadData(op);
  }
})