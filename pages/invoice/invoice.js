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
    //  房间号
    roomNumber: '',
    //  是否在搜索
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
          seller_id: res.data.seller_id
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
      if ( res ) {
        this.setData({
          type: res.type,
          title: res.title,
          taxNumber: res.tax_number,
          companyAddress: res.company_address,
          telephone: res.telephone,
          bankName: res.bank_name,
          bankAccount: res.bank_account
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
  //  搜索发票抬头
  searchTitle: function (e) {
    let { value } = e.detail;
    if ( this.data.type == 2 ) {
      return;
    } else if ( !value ) {
      this.setData({
        isSearch: false,
        titleList: []
      });
    } else if ( value.length > 1 ) {
      request.searchTitle({
        user_id: this.data.user_id,
        seller_id: this.data.seller_id,
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
    let { user_id, seller_id, type, title, taxNumber, roomNumber } = e.detail.value;
    let params = null;
    if ( !title.length ) {
      wx.showToast({
        title: '请填写抬头名称',
        icon: 'none'
      });
      return;
    } else if ( !taxNumber ) {
      wx.showToast({
        title: '请填写税号',
        icon: 'none'
      });
      return;
    } else if ( taxNumber.length < 15) {
      wx.showToast({
        title: '请正确填写税号',
        icon: 'none'
      });
      return;
    } else if ( type == 1 ) {
      //  单位类型参数
      params = e.detail.value;
    } else if ( type == 2 ) {
      //  个人类型参数
      params = {
        user_id,
        seller_id,
        type,
        title,
        taxNumber,
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
    .then(res => {
      let type = res.type == 0 ? 1 : 2;
      this.setData({
        ...res,
        type,
        isSearch: false,
        titleList: []
      });
    });
  }
})