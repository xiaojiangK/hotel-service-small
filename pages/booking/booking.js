// pages/booking/booking.js
const app = getApp();
var Moment = require("../../utils/moment.js");
import { formatDate } from '../../utils/tool.js'

Page({
  data: {
    start: [],
    end: [],
    days: 1,
    endWeek: '',
    startWeek: '',
    roomList: [],
    swiper: [],
    isGetPhoneNumber: false,
    isMchid: '',
    room_booking:1,
    //  Tab 索引
    tabIndex: 0,
    //  是否显示房间详情
    isShowRoomDetail: false,
    //  详情滑块图片
    roomSwiper: [
      'https://static.hotel.showboom.cn/images/15/2019/06/h4i4cN5NoCN7no36WQ6whwZ6Bc4030.png?x-oss-process=image/resize,m_mfit,h_300,w_400',
      'https://static.hotel.showboom.cn/images/15/2019/06/CF38FKqdLq8yCK18KFfKlcFqs8Q3FC.png?x-oss-process=image/resize,m_mfit,h_300,w_400',
      'https://static.hotel.showboom.cn/images/15/2019/06/NqnPD98APe4U90900N9p0LJm84z1u0.png?x-oss-process=image/resize,m_mfit,h_300,w_400'
    ],
    //  详情滑块图片索引
    roomSwiperIndex: 0,
    //  酒店服务
    serviceList: [
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      },
      {
        imgUrl: '/assets/image/icon-wifi.png',
        name: '无线上网'
      }],
    //  评论标签索引
    commentTagIndex: 0,
    //  评论列表
    commentList: [],
    assessCount: {},
    hotel: {}
  },
  //  页面显示
  onShow() {
    this.initDate();
    this.changePhoneNumber();
  },
  onLoad() {
    this.loadData();
  },
  //  初始化数据
  initDate() {
    let _this = this
    //获取权限
    wx.getStorage({
      key: 'hotel',
      success: function(res) {
        let { room_booking } = res.data || 1
        _this.setData({
          room_booking: room_booking
        })
      },
    })
    // 保存的日期
    wx.getStorage({
      key: 'ROOM_SOURCE_DATE',
      success: (res) => {
        const startDate = res.data.checkInDate;
        const endDate = res.data.checkOutDate;
        const start = startDate.split('-');
        const end = endDate.split('-');
        const w = new Date(startDate).getDay();
        const w2 = new Date(endDate).getDay();
        let startWeek = this.formatWeek(w);
        let endWeek = this.formatWeek(w2);
        const days = Moment(endDate).differ(startDate);
        this.setData({ days, start, end, startWeek, endWeek });
      }
    });
    this.getAssess();
    this.getAssessCount();
  },
  //  获取手机号
  getUserPhoneNumber(e){
    app.getUserPhoneNumber(e, this);
    // app.userLogin();
  },
  //  校验手机号
  changePhoneNumber() {
    wx.getStorage({
      key: 'userinfo',
      fail: (res) => {
        if(res.data.tel) {
          this.setData({
            isGetPhoneNumber: false
          });
        } else {
          this.setData({
            isGetPhoneNumber: true
          });
        }
      }
    });
  },
  //  加载数据
  loadData() {
    this.setData({
      isMchid:app.globalData.isMchid
    })
    wx.getStorage({
      key: 'system',
      success: (res)=>{
        app.util.request({
          url: "entry/wxapp/RoomList",
          data: {
            start: this.data.start.join('-'),
            end: this.data.end.join('-'),
            seller_id: res.data.id
          },
          success:(res) => {
            let swiper = [];
            const roomList = res.data.map(item => {
              if (item.state == '1') {
                swiper.push(item.logo+app.globalData.imgSize);
              }
              return {
                ...item,
                logo: item.logo+app.globalData.imgSize,
                price: Math.ceil(item.min_price)
              }
            });
            this.setData({ roomList, swiper, isMchid: app.globalData.isMchid });
          }
        });
      }
    });
    this.getHotelDetail();
  },
  getHotelDetail() {
    app.util.request({
      url: "entry/wxapp/GetSystem",
      success:(res) => {
        app.util.request({
          url: "entry/wxapp/PjDetails",
          data: {
            uniacid: res.data.uniacid
          },
          success:(res) => {
            this.setData({
              hotel: res.data
            });
            console.log(res.data);
          }
        });
      }
    });
  },
  // 获取评论数量
  getAssessCount() {
    wx.getStorage({
      key: 'userinfo',
      success: (res)=>{
        app.util.request({
          url: "entry/wxapp/AssessCount",
          data: {
            user_id: res.data.id
          },
          success: (res) => {
            this.setData({ assessCount: res.data });
          }
        });
      }
    });
  },
  // 获取评论列表
  getAssess() {
    app.util.request({
      url: "entry/wxapp/AssessList",
      data: {
        page: 1,
        img_type: this.data.commentTagIndex
      },
      success: (res) => {
        const commentList = res.data.map(item => {
          return {
            ...item,
            speaker: "酒店回复：",
            time: formatDate(item.time * 1000),
            reply_time: formatDate(item.reply_time * 1000),
            arrival_time: formatDate(item.arrival_time * 1000),
            img: item.img && item.img.map(item => item.img_url)
          }
        });
        this.setData({ commentList });
      }
    });
  },
  //  选择TAB标签
  chooseTab: function (e) {
    let { index } = e.currentTarget.dataset;
    this.setData({
      tabIndex: index
    });
  },
  //  选择日期
  selectDate(){
    wx.navigateTo({
      url: '/pages/calendar/index'
    });
  },
  //  格式化周
  formatWeek(w) {
    if (w == 0) {
      return '周日';
    } else {
      return '周' + app.integer(w);
    }
  },
  //  查看房间详情
  toggleDetail: function () {
    this.setData({
      isShowRoomDetail: !this.data.isShowRoomDetail
    });
  },
  //  详情滑块切换
  roomSwiperChange: function (e) {
    let { current } = e.detail;
    this.setData({
      detailSwiperIndex: current
    });
  },
  //  选择评论标签
  chooseCommentTag: function (e) {
    let { index } = e.currentTarget.dataset;
    this.setData({
      commentTagIndex: index
    });
    this.getAssess();
  },
  //  支付
  goPay(e) {
    const room = e.currentTarget.dataset.room;
    if (!room.min_num || room.min_num == '0') {
      return;
    }
    const data = this.data;
    wx.setStorage({
      key: 'room',
      data: {
        ...room,
        startWeek: data.startWeek,
        endWeek: data.endWeek,
        days: data.days,
        start: data.start,
        end: data.end
      }
    });
    wx.navigateTo({
      url: '/pages/bookingOrder/bookingOrder'
    });
  },
  //  转发
  onShareAppMessage: function () {
  }
})