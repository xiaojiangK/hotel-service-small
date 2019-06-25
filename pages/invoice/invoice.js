const api = require('./../../utils/api');
const request = require('./../../utils/request');

Page({
  data: {
    //  状态
    state: '',
    //  用户标识
    user_id: '',
    //  酒店标识
    seller_id: '',
    uniacid: '',
    //  开票类型
    type: 1,
    //  抬头名称
    title: '',
    //  税号
    taxNumber: '',
    //  单位地址
    companyAddress: '',
    //  单位电话
    telephone: '',
    //  开户银行
    bankName: '',
    //  银行账号
    bankAccount: '',
    //  名称
    name: '',
    //  房间号
    roomNumber: '',
    //  搜索开关
    searchOnOff: false,
    //  是否在搜索中
    isSearch: false,
    //  抬头列表
    titleList: []
  },
  //  页面加载
  onLoad: function (opt) {
    let { state } = opt;
    if ( state && state == 'build') {
      this.setData({
        state
      });
      return;
    }
    this.getInfo();
  },
  //  获取用户标识酒店标识
  getInfo: function () {
    //  获取用户标识
    api.getStorage({key: 'userinfo'})
    .then(res => {
      if ( res.data ) {
        this.setData({
          user_id: res.data.id
        });
        this.getLastInvoice();
      }
    });
    //  获取酒店标识
    api.getStorage({key: 'system'})
    .then(res => {
      if ( res.data ) {
        this.setData({
          seller_id: res.data.seller_id,
          uniacid: res.data.uniacid
        });
      }
    });
  },
  //  获取最后申请的发票信息
  getLastInvoice: function () {
    request.getLastInvoice({
      user_id: this.data.user_id
    })
    .then(res => {
      if ( res && res.type == 1 ) {
        //  单位信息回填
        this.setData({
          type: res.type,
          title: res.title,
          taxNumber: res.tax_number,
          companyAddress: res.company_address,
          telephone: res.telephone,
          bankName: res.bank_name,
          bankAccount: res.bank_account
        });
      } else if (res && res.type == 2) {
        //  个人信息回填
        this.setData({
          type: res.type,
          name: res.title
        });
      }
    });
  },
  //  选择类型
  chooseType: function (e) {
    let { type } = e.currentTarget.dataset;
    this.setData({
      type
    });
  },
  //  发票搜索开始
  searchTitleStart: function () {
    this.setData({
      searchOnOff: true
    });
  },
  //  发票搜索结束
  searchTitleEnd: function () {
    if (!this.data.titleList) {
      this.setData({
        isSearch: false
      });
    }
  },
  //  搜索发票抬头
  searchTitle: function (e) {
    let { value } = e.detail;
    if ( !value ) {
      this.setData({
        isSearch: false,
        titleList: []
      });
    } else if (value.length > 1 && this.data.searchOnOff) {
      request.searchTitle({
        user_id: this.data.user_id,
        seller_id: this.data.seller_id,
        uniacid: this.data.uniacid,
        title: value
      })
      .then(res => {
        if ( res ) {
          this.setData({
            isSearch: true,
            titleList: res
          });
        }
      });
    }
  },
  //  选择发票抬头
  chooseTitle: function (e) {
    let { title:invoice } = e.currentTarget.dataset;
    this.setData({
      isSearch: false,
      titleList: [],
      searchOnOff: false,
      title: invoice.title,
      taxNumber: invoice.tax_number,
      companyAddress: invoice.company_address,
      telephone: invoice.telephone,
      bankName: invoice.bank_name,
      bankAccount: invoice.bank_account
    });
  },
  //  申请开票
  applyInvoice: function (e) {
    let { 
      user_id,
      seller_id,
      uniacid,
      type,
      title,
      taxNumber,
      companyAddress,
      telephone,
      bankName,
      bankAccount,
      name,
      roomNumber
    } = e.detail.value;
    let params = null;
    if ( type == 1 && !title.length ) {
      wx.showToast({
        title: '请填写抬头名称',
        icon: 'none'
      });
      return;
    } else if ( type == 1 && !taxNumber ) {
      wx.showToast({
        title: '请填写税号',
        icon: 'none'
      });
      return;
    } else if ( type == 1 && taxNumber.length < 15) {
      wx.showToast({
        title: '请正确填写税号',
        icon: 'none'
      });
      return;
    } else if (type == 2 && !name.length) {
      wx.showToast({
        title: '请填写名称',
        icon: 'none'
      });
      return;
    } else if ( type == 1 ) {
      //  单位类型参数
      params = {
        user_id,
        seller_id,
        uniacid,
        type,
        title,
        taxNumber,
        companyAddress,
        telephone,
        bankName,
        bankAccount,
        roomNumber
      };
    } else if ( type == 2 ) {
      //  个人类型参数
      params = {
        user_id,
        seller_id,
        uniacid,
        type,
        title: name,
        roomNumber 
      };
    }
    request.applyInvoice({
      ...params
    })
    .then(res => {
      if ( res == 1 ) {
        wx.redirectTo({
          url: '/pages/invoiceResult/invoiceResult'
        })
      }
    });
  },
  //  选择微信里的发票抬头
  chooseWXTitle: function () {
    api.chooseInvoiceTitle()
    .then(res => {console.log(res);
      if (res.type == 0) {
        //  单位
        this.setData({
          ...res,
          type: 1,
          isSearch: false,
          titleList: []
        });
      } else {
        //  个人
        this.setData({
          type: 2,
          name: res.title
        });
      }
    });
  },
  onShareAppMessage: function () {
  }
})