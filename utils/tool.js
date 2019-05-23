const config = require('./../config/index');
const api = require('./api');
import dayjs from './dayjs.js';

//  接口地址前缀
const baseURL = config.baseURL;

//  GET 请求
let get = (op = {}) => {
  return api.request({
    url: baseURL + op.path,
    ...op,
    header: {
      token: wx.getStorageSync('token') || ''
    },
    method: 'GET'
  }).then(res => {
    return res.data;
  });
};

//  POST 请求
let post = (op = {}) => {
  if (!op.header) {
    op.header = {}
  }
  return api.request({
    url: baseURL + op.path,
    ...op,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...op.header,
      token: wx.getStorageSync('token') || ''
    },
    method: 'POST'
  }).then(res => {
    return res.data;
  });
};

// 倒计时
export function countDown(time, that) {
  const date1 = dayjs(time * 1000 + (60 * 30 * 1000));
  const date2 = dayjs(Date.now());
  if (date1 > date2) {
      const hour = date1.diff(date2, 'hour');
      const date3 = date2.add(hour, 'hour');
      const minute = date1.diff(date3, 'minute');
      const date4 = date3.add(minute, 'minute');
      const second = date1.diff(date4, 'second');
      that.setData({
        time: (minute < 10 ? '0'+minute : minute || '00') +':'+ (second < 10 ? '0'+second : second || '00')
      });
  }
}

// 日期时间
export function formatDateTime(time) {
    const date = new Date(time);
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const n = date.getMinutes();
    const s = date.getSeconds();
    return `${date.getFullYear()}-${m < 10 ? '0'+m : m}-${d < 10 ? '0'+d : d} ${h < 10 ? '0'+h : h}:${n < 10 ? '0'+n : n}:${s < 10 ? '0'+s : s}`;
}

// 时间
export function formatTime(time) {
    const date = new Date(time);
    const h = date.getHours();
    const n = date.getMinutes();
    const s = date.getSeconds();
    return `${h < 10 ? '0'+h : h}:${n < 10 ? '0'+n : n}:${s < 10 ? '0'+s : s}`;
}

// 日期
export function formatDate(time) {
    const date = new Date(time);
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${date.getFullYear()}-${m < 10 ? '0'+m : m}-${d < 10 ? '0'+d : d}`;
}

// 月日
export function formatMonth(time) {
    const date = new Date(time);
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${m < 10 ? '0'+m : m}月${d < 10 ? '0'+d : d}日`;
}


/*
 *  用户
 *  用户登录
 */
exports.userLogin = code => {
  return post({
    path: '',
    data: {
      code
    }
  })
};

