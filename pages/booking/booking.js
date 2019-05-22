// pages/booking/booking.js

const app = getApp()
Page({
  data: {
    start: [],
    end: [],
    dayNum: 1,
    endWeek: '',
    startWeek: '',
    dateVisible: true,
    roomList: [],
    swiper: []
  },
  goPay(e) {
    const room = e.currentTarget.dataset.room;
    if (room.total_num == 0) {
      return;
    }
    const data = this.data;
    wx.setStorage({
      key: 'room',
      data: {
        ...room,
        startWeek: data.startWeek,
        endWeek: data.endWeek,
        dayNum: data.dayNum,
        start: data.start,
        end: data.end
      }
    });
    wx.navigateTo({
      url: `/pages/bookingOrder/bookingOrder`
    });
  },
  yunxin(){
    this.setData({ dateVisible: false });
    this.rili = this.selectComponent("#rili");
    let dayNum = '';
    let startWeek = '';
    let endWeek = '';
    this.rili.xianShi({
      data: (res) => {
        if (res && res.length == 2) {
            console.log(res);   //选择的日期
            dayNum = res[1].chaDay;
            const start = res[0].data.split('-');
            const end = res[1].data.split('-');
            const date = new Date(res[0].data).getDay();
            const date2 = new Date(res[1].data).getDay();
            
            if (date == 0) {
                startWeek = '周日'
            } else {
                startWeek = '周' + app.integer(date);
            }
            if (date2 == 0) {
                endWeek = '周日'
            } else {
                endWeek = '周' + app.integer(date2);
            }
            this.setData({ start, end, dayNum, startWeek, endWeek });
        }
      }
    })
  },
  init() {
    let t = new Date();
    let w = t.getDay();
    let startWeek = '';
    let endWeek = '';
    if (w == 0) {
      startWeek = '周日';
    } else {
      startWeek = '周' + app.integer(w);
    }
    if (w == 0) {
      endWeek = '周一';
    } else if (w == 6){
      endWeek = '周日';
    } else {
      endWeek = '周' + app.integer(w+1);
    }
    const m = t.getMonth() + 1;
    const d = t.getDate();
    let start = [t.getFullYear(), m < 10 ? '0'+m : m, d < 10 ? '0'+d : d];
    let end = [t.getFullYear(), m < 10 ? '0'+m : m, (d + 1) < 10 ? '0'+(d + 1) : (d + 1)];
    this.setData({ start, end, startWeek, endWeek });
  },
  loadData() {
    wx.getStorage({
      key: 'system',
      success: (res)=>{
        app.util.request({
          url: "entry/wxapp/RoomList",
          data: {
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
                price: Number.isInteger(Number.parseFloat(item.price)) ? Number.parseInt(item.price) : item.price
              }
            });
            this.setData({ roomList, swiper });
          }
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.init();
    this.loadData();
  }

  // changePhoneNumber() {
  //   var that = this
  //   if(app.globalData.phoneNumber != '')
  //     that.setData({
  //       isGetPhoneNumber:false
  //     })
  //   else
  //     that.setData({
  //       isGetPhoneNumber:true
  //     }) 
  // },
  // getUserPhoneNumber(e){
  //   console.log(e.detail.phoneNumber)
  //   if(e.detail.phoneNumber) {
  //     app.globalData.phoneNumber = e.detail.phoneNumber
  //     wx.setStorageSync('phoneNumber',e.detail.phoneNumber)
  //     this.changePhoneNumber()
  //   }
  // }
})