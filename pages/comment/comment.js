var app = getApp();
import { formatDate } from '../../utils/tool.js';

Page({
  data: {
    //  评价
    comment: {},
    orderId: 0
  },
  onLoad(opts) {
    this.setData({
      orderId: opts.orderId
    });
  },
  onShow() {
    this.getAssess();
  },
  // 获取评论列表
  getAssess() {
    app.util.request({
      url: "entry/wxapp/AssessList",
      data: {
        order_id: this.data.orderId
      },
      success: (res) => {
        const comment = res.data.map(item => {
          return {
            ...item,
            speaker: "酒店回复：",
            time: formatDate(item.time * 1000),
            reply_time: formatDate(item.reply_time * 1000),
            arrival_time: formatDate(item.arrival_time * 1000),
            img: item.img && item.img.map(item => item.img_url)
          }
        });
        this.setData({ comment: comment[0] });
      }
    });
  },
  //  转发
  onShareAppMessage: function () {
  }
})