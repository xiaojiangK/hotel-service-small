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
    //  详情滑块图片索引
    roomSwiperIndex: 0,
    //  评论标签索引
    commentTagIndex: 0,
    //  评论列表
    commentList: [],
    assessCount: {},
    hotel: {},
    roomDetail: {}
  },
  //  页面显示
  onShow() {
    this.initDate();
    this.loadData();
    this.changePhoneNumber();
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
  goCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.hotel.tel
    });
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
            const hotel = res.data;
            let service = [];
            if (hotel.service) {
              for (let i in hotel.service) {
                service.push({
                  id: i,
                  val: hotel.service[i]
                });
              }
            }
            this.setData({
              hotel: {
                ...hotel,
                service
              }
            });
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
  toggleDetail: function (e) {
    this.setData({
      isShowRoomDetail: !this.data.isShowRoomDetail
    });
    const item = e.currentTarget.dataset.item;
    if (item) {
      app.util.request({
        url: "entry/wxapp/RoomDetails",
        data: {
          room_id: item.id
        },
        success: (res) => {
          const data = res.data;
          let facilities = [];
          if (data.facilities) {
            for (let i of data.facilities) {
              for (let j in i) {
                facilities.push({
                  id: j,
                  value: i[j]
                });
              }
            }
          }
          const roomDetail = {
            ...data,
            facilities,
            min_num: item.min_num,
            img: data.img ? data.img : [] 
          }
          this.setData({ roomDetail });
        }
      });
    }
  },
  //  详情滑块切换
  roomSwiperChange: function (e) {
    let { current } = e.detail;
    this.setData({
      roomSwiperIndex: current
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