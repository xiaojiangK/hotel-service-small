var app = getApp();
const api = require('./../../utils/api');
var siteinfo = require("../../siteinfo.js");


Page({
  data: {
    //  内容
    content: '',
    //  字数限制
    countLimit: 100,
    //  字数
    count: 0,
    //  图片数限制
    imageLimit: 4,
    //  照片临时列表
    photoListTemp: [],
    //  照片列表
    photoList: [],
    roomId: '',
    orderId: ''
  },
  onLoad(opts) {
    this.setData({
      orderId: opts.orderId,
      roomId: opts.roomId
    });
  },
  //  内容输入
  contentChange: function (e) {
    let { value } = e.detail;
    this.setData({
      content: value,
      count: value.length
    });
  },
  //  选择图片
  chooseImage: function (e) {
    api.chooseImage({
      count: this.data.imageLimit - this.data.photoListTemp.length
    })
    .then(res => {
      if (res.errMsg === 'chooseImage:ok') {
        let tempFilePaths = res.tempFilePaths;
        for (let i = 0; i < tempFilePaths.length; i++) {
          this.data.photoListTemp.push(tempFilePaths[i]);
        }
        this.setData({
          photoList: this.data.photoListTemp
        });
      }
    });
  },
  //  删除图片
  deleteImage: function (e) {
    let { index } = e.currentTarget.dataset;
    api.showModal({
      title: '提示',
      content: '点击确定后，将删除图片'
    })
    .then(res => {
      if (res.confirm) {
        this.data.photoListTemp.splice(index, 1);
        this.setData({
          photoList: this.data.photoListTemp
        });
      }
    });
  },
  //  预览图片
  previewImage: function (e) {
    let { index } = e.currentTarget.dataset;
    api.previewImage({
      current: this.data.photoListTemp[index],
      urls: this.data.photoListTemp 
    });
  },
  //  取消
  cancel: function () {
    api.showModal({
      title: '提示',
      content: '点击确定后，编辑内容将清空'
    })
    .then(res => {
      if (res.confirm) {
        api.navigateBack({
          delta: 1
        });
      }
    });
  },
  //  发布
  submit: function () {
    //  未填写内容
    if (!this.data.content) {
      api.showToast({
        title: '请写出您的想法',
        icon: 'none'
      });
    } else {
      wx.showLoading({
        title: '上传中...',
        mask: true,
      });
      // 上传图片
      let img = [];
      const list =  this.data.photoList;
      if (list.length == 0) {
        this.saveAssess();
        return;
      }
      for (let i of list) {
        wx.uploadFile({
          url: `${siteinfo.siteroot}/app/index.php?i=${siteinfo.uniacid}&t=${siteinfo.multiid}&v=${siteinfo.version}&from=wxapp&c=entry&a=wxapp&do=Upload&m=${siteinfo.m}&sign=97ee8bbbe3ff73812178dfd39089323d&upfile=${i}`,
          filePath: i,
          header: {  
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
          },
          name: 'file',
          success: (res) => {
            img.push(res.data);
          },
          complete: () => {
            if (img.length == list.length) {
              this.saveAssess(img);
            }
            wx.hideLoading();
          }
        });
      }
    }
  },
  //  提交评价
  saveAssess(img = []) {
    wx.getStorage({
      key: 'userinfo',
      success: (res)=>{
        app.util.request({
          url: "entry/wxapp/SaveAssess",
          data: {
            img: img.join(','),
            room_id: this.data.roomId,
            order_id: this.data.orderId,
            content: this.data.content,
            user_id: res.data.id
          },
          success: (res) => {
            api.showToast({
              title: '上传成功',
              icon: 'none'
            });
            api.navigateBack({
              delta: 1
            });
          },
          fail:() => {
            api.showToast({
              title: '上传失败，请重试',
              icon: 'none'
            });
          }
        });
      }
    });
  },
  //  转发
  onShareAppMessage: function () {
  }
})