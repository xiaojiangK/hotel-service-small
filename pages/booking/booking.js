// pages/booking/booking.js
const app = getApp();
var Moment = require("../../utils/moment.js");

Page({
  data: {
    start: [],
    end: [],
    days: 1,
    endWeek: '',
    startWeek: '',
    roomList: [],
    swiper: [],
    isGetPhoneNumber: false
  },
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
  selectDate(){
    wx.navigateTo({
      url: '/pages/calendar/index'
    });
  },
  initDate() {
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
        this.loadData();
      }
    });
  },
  loadData() {
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
                swiper.push(app.globalData.url + item.logo);
              }
              return {
                ...item,
                logo: app.globalData.url + item.logo,
                price: Number.isInteger(Number.parseFloat(item.min_price)) ? Number.parseInt(item.min_price) : item.min_price.toFixed(2)
              }
            });
            this.setData({ roomList, swiper });
          }
        });
      }
    });
  },
  formatWeek(w) {
    if (w == 0) {
      return '周日';
    } else {
      return '周' + app.integer(w);
    }
  },
  onShow() {
    this.initDate();
    this.changePhoneNumber();
  },
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
  getUserPhoneNumber(e){
    app.getUserPhoneNumber(e);
    app.userLogin();
    this.changePhoneNumber();
  }
})