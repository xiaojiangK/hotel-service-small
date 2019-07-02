const api = require('./../../utils/api');

Page({
  data: {
    comment: {
      //  头像
      avatarUrl: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=865200461,3363625639&fm=26&gp=0.jpg',
      //  昵称
      nickname: 'xtp231200153',
      //  房间类型
      type: '经济大床房',
      //  评论内容
      content: '位置不太好找，门面太小。前台小哥哥小姐姐服务态度很好，很有耐心。价格在这位置不算贵，房间是二层有窗，但是窗外是墙体。感觉一层是半地下，二层就是一层的样子。打开房间很整洁就是烟味特别大，还得先打开排风扇',
      //  图片
      photo: [
        'https://static.hotel.showboom.cn/images/15/2019/06/h4i4cN5NoCN7no36WQ6whwZ6Bc4030.png?x-oss-process=image/resize,m_mfit,h_300,w_400',
        'https://static.hotel.showboom.cn/images/15/2019/06/CF38FKqdLq8yCK18KFfKlcFqs8Q3FC.png?x-oss-process=image/resize,m_mfit,h_300,w_400',
        'https://static.hotel.showboom.cn/images/15/2019/06/NqnPD98APe4U90900N9p0LJm84z1u0.png?x-oss-process=image/resize,m_mfit,h_300,w_400'
        
      ],
      //  入住时间
      checkInDatetime: '2019-02',
      //  发表时间
      publishDatetime: '2019-02-15',
      //  回复列表
      replyList: [
        {
          speaker: '酒店回复：',
          content: '位置不太好找，门面太小。前台小哥哥小姐姐服务态度很好，很有耐心。',
          datetime: '2019-02-15'
        }
      ]
    }
  },
  //  预览图片
  previewImage: function (e) {
    let { index } = e.currentTarget.dataset;
    api.previewImage({
      current: this.data.comment.photo[index],
      urls: this.data.comment.photo 
    });
  },
  //  转发
  onShareAppMessage: function () {
  }
})