const api = require('./../../utils/api');

Page({
  data: {
    //  appId
    appId: '',
    //  开票类型
    type: 0,
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
    //  留言
    comment: '',
    //  列表
    datalist: []
  },
  //  页面加载
  onLoad: function () {
    const accountInfo = wx.getAccountInfoSync();
    this.setData({
      appId: accountInfo.miniProgram.appId
    });
    this.getLocalInfo();
  },
  //  获取上次存储的发票信息
  getLocalInfo: function () {
    api.getStorage({
      key: 'invoice'
    })
    .then(res => {
      if ( res.data ) {
        this.setData({
          ...res.data
        });
      }
    }, err => {
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
    if ( !value ) {
      this.setData({
        datalist: []
      });
    } else {
      this.setData({
        datalist: [
          { title: '北京秀豹科技有限公司'},
          { title: '北京秀豹科技有限公司'},
          { title: '北京秀豹科技有限公司北京秀豹科技有限公司'},
          { title: '北京秀豹科技有限公司'}
        ]
      });
    }
  },
  //  选择公司
  chooseCompany: function (e) {
    let { title } = e.currentTarget.dataset;
    this.setData({
      datalist: []
    });
  },
  //  申请开票
  apply: function (e) {
    let { appId, type } = this.data;
    let { title, taxNumber, companyAddress, telephone, bankName, bankAccount, roomNumber } = e.detail.value;
    if ( !title.length ) {
      this.showToast('请输入抬头名称');
    } else if ( !taxNumber ) {
      this.showToast('请输入税号');
    } else if ( taxNumber.length < 15) {
      this.showToast('请正确输入税号');
    } else {
      console.log('去申请');
      this.setInfo(e.detail.value);
    }
  },
  //  保存本次发票信息
  setInfo: function (invoice) {
    let { type, title, taxNumber, companyAddress, telephone, bankName, bankAccount } = invoice;
    api.setStorage({
      key: 'invoice',
      data: {
        type, 
        title, 
        taxNumber, 
        companyAddress, 
        telephone, 
        bankName, 
        bankAccount
      }
    })
  },
  //  提示信息
  showToast: function (content) {
    wx.showToast({
      title: content,
      duration: 2000
    });
  },
  //  选择微信里的发票抬头
  chooseTitle: function () {
    api.chooseInvoiceTitle()
    .then(res => {
      let { type, title, taxNumber, companyAddress, telephone, bankName, bankAccount } = res;
      if (type == 0) {
        //  企业
        this.setData({
          type,
          title,
          taxNumber,
          companyAddress,
          telephone,
          bankName,
          bankAccount
        });
      } else {
        //  个人
        this.setData({
          type,
          title
        });
      }
    });
  },
})