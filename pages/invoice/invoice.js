const api = require('./../../utils/api');
const request = require('./../../utils/request');
const app = getApp()
Page({
  data: {
    //  状态
    state: '',
    //  用户标识
    user_id: '',
    //  酒店标识
    seller_id: '',
    uniacid: '',
    //用户openId
    wxopenid:'',
    //  发票抬头
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
    //手机号
    roomTel: '',
    //  搜索开关
    searchOnOff: false,
    //  是否在搜索中
    isSearch: false,
    //  抬头列表
    titleList: [],

    //发票类型
    rec_mold:2,

    //是否数据加载完成
    isReady: true,
    
    //专票
    receipt_professional:1,
    //普票
    receipt_normal:1,
    //电子票
    receipt_e: 1

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
    let config = app.globalData.hotelConfig
    this.setData({
      receipt_e: config.receipt_e,
      receipt_normal: config.receipt_normal,
      receipt_professional: config.receipt_professional
    })
    this.getInfo();
  },
  //  获取用户标识酒店标识
  getInfo: function () {
    //  获取用户标识
    api.getStorage({key: 'userinfo'})
    .then(res => {
      if ( res.data ) {
        this.setData({
          user_id: res.data.id,
          wxopenid: res.data.openid,
          roomTel: res.data.tel
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
      if (res && res.rec_mold ==2 ){
        this.setData({
          rec_mold: res.rec_mold,
          type: res.type,
          title: res.title,
          taxNumber: res.tax_number,
          companyAddress: res.company_address,
          telephone: res.telephone,
          bankName: res.bank_name,
          bankAccount: res.bank_account
        });
      }else{
        if (res.type == 1) {
          //  单位信息回填
          this.setData({
            rec_mold: res.rec_mold,
            type: res.type,
            title: res.title,
            taxNumber: res.tax_number,
            // companyAddress: res.company_address,
            // telephone: res.telephone,
            // bankName: res.bank_name,
            // bankAccount: res.bank_account
          });
        } else if (res && res.type == 2) {
          //  个人信息回填
          this.setData({
            rec_mold: res.rec_mold,
            type: res.type,
            name: res.title
          });
        }
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
  selectInoice(e){
    let { rec_mold } = e.currentTarget.dataset;
    
    if (rec_mold == 2){
      this.setData({
        rec_mold,
        type:1
      });
    }else{
      this.setData({
        rec_mold
      });
    }
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
    let invoice = e.currentTarget.dataset.title;
    let rec_mold = this.data.rec_mold
    if(rec_mold == 2){
      this.setData({
        isSearch: false,
        titleList: [],
        searchOnOff: false,
        isReady: false,
        title: invoice.title,
        taxNumber: invoice.tax_number,
        companyAddress: invoice.company_address,
        telephone: invoice.telephone,
        bankName: invoice.bank_name,
        bankAccount: invoice.bank_account
      }, function (res) {
        this.setData({
          isReady: true
        })
      });
    }else{
      this.setData({
        isSearch: false,
        titleList: [],
        searchOnOff: false,
        isReady: false,
        title: invoice.title,
        taxNumber: invoice.tax_number,
        // companyAddress: invoice.company_address,
        // telephone: invoice.telephone,
        // bankName: invoice.bank_name,
        // bankAccount: invoice.bank_account
      }, function (res) {
        this.setData({
          isReady: true
        })
      });
    }
    
  },
  //  申请开票
  applyInvoice: function (e) {
    if (!this.data.isReady){
      return
    }
    let { 
      user_id,
      seller_id,
      uniacid,
      type,
      rec_mold,
      wxopenid,
      title,
      taxNumber,
      companyAddress,
      telephone,
      bankName,
      bankAccount,
      name,
      roomNumber,
      roomTel
    } = e.detail.value;

    let wxformid = e.detail.formId
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
    } else if (type == 1 && rec_mold==2  ){
      if (companyAddress == '' ||
        telephone == ''||
        bankName == ''||
        bankAccount == '') {
        wx.showToast({
          title: '请填写完整信息',
          icon: 'none'
        });
        return;
      }
    } else if (type == 2 && !name.length) {
      wx.showToast({
        title: '请填写名称',
        icon: 'none'
      });
      return;
    }
    
    if (rec_mold == 2 && this.data.receipt_professional != 1){
      wx.showToast({
        title: '请选择发票类型后申请发票',
        icon: 'none'
      });
      return
    } else if (rec_mold == 1 && this.data.receipt_normal != 1){
      wx.showToast({
        title: '请选择发票类型后申请发票',
        icon: 'none'
      });
      return
    } else if (rec_mold == 3 && this.data.receipt_e != 1){
      wx.showToast({
        title: '请选择发票类型后申请发票',
        icon: 'none'
      });
      return
    }

    if (rec_mold == 2 ) {
      //  专票类型参数
      params = {
        user_id,
        seller_id,
        uniacid,
        wxopenid,
        type,
        rec_mold,
        title,
        taxNumber,
        companyAddress,
        telephone,
        bankName,
        bankAccount,
        roomNumber,
        user_tel:roomTel,
        wxformid
      };
    } else{ 
      if ( type == 2 ) {
      //  普票个人类型参数
        params = {
          user_id,
          seller_id,
          uniacid,
          wxopenid,
          type,
          rec_mold,
          title: name,
          roomNumber,
          user_tel: roomTel,
          wxformid 
        };
      } else if (type == 1){
        //普票单位类型参数
        params = {
          user_id,
          seller_id,
          uniacid,
          wxopenid,
          type,
          rec_mold,
          title,
          taxNumber,
          roomNumber,
          user_tel: roomTel,
          wxformid
        };
      }
    }

    //检测数据
    console.log(params)
    
    request.applyInvoice({
      ...params
    })
    .then(res => {
      if ( res == 1 ) {
        wx.navigateTo({
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
          isReady: false,
          titleList: []
        },function(){
          this.setData({
            isReady: true
          })
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