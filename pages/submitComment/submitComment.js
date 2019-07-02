const api = require('./../../utils/api');

Page({
  data: {
    //  内容
    content: '',
    //  字数限制
    countLimit: 100,
    //  字数
    count: 0,
    //  图片数限制
    imageLimit: 9,
    //  照片临时列表
    photoListTemp: [],
    //  照片列表
    photoList: []
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
    if (!this.data.content) {
      //  未填写内容
      api.showToast({
        title: '请写出您的想法',
        icon: 'none'
      });
    } else {
      //  提交评价
      
    }
  },
  //  转发
  onShareAppMessage: function () {
  }
})