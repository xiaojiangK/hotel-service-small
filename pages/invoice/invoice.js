Page({
  data: {
    access_token: '21_cPQEaIv47btu0zfLR0vo98xmRXmUNf4akRd7OWNFmcNVMNSEdFbIZx_O7uRM0MDYpYJE6Qfs0lOfnJmxizrUM6_xqtVnxDNzGVJw1jsHdtvaWcVMDa9RklecURBMilc_kC4fVx4cBxJmHFD2XVAiAEAFDI',
    //  发票类型
    type: 0,
    //  用户姓名
    username: '',
    //  抬头
    title: '',
    //  税号
    taxNumber: '',
    //  单位名称
    company: '',
    //  电话号码
    telephone: '',
    //  开户银行
    bankName: '',
    //  银行账户
    bankAccount: ''
  },
  //  页面加载
  onLoad: function () {
    wx.authorize({
      scope: 'scope.invoiceTitle',
      success() {
        wx.showToast({
          title: '授权成功',
          duration: 2000
        })
      },
      fail() {
        wx.showToast({
          title: '授权失败',
          duration: 2000
        })
      }
    });
    const accountInfo = wx.getAccountInfoSync()
    console.log(accountInfo.miniProgram.appId) // 小程序 appId

  },
  //  切换类型
  typeSwitch: function (e) {
    let { type } = e.currentTarget.dataset;
    this.setData({
      type
    });
  },
  save1: function (e) {
    let { username, title, taxNumber, company, telephone, bankName, bankAccount } = e.detail.value;
    if (this.data.type == 0) {
      // 企业
      wx.request({
        url: `https://api.weixin.qq.com/card/invoice/biz/getusertitleurl?access_token=${this.data.access_token}`,
        data: {
          title,
          tax_no: taxNumber,
          phone: telephone,
          bank_type: bankName,
          bank_no: bankAccount
        },
        method: 'POST', 
        success: function(res){
          if (res.data.errcode == 0) {
            console.log(res.data.url);
            wx.redirectTo({
              url: `${res.data.url}`
            })
          }
        },
        fail: function(res) {
          console.log(res);
        }
      });
    } else {
      // 个人
      wx.request({
        url: `https://api.weixin.qq.com/card/invoice/biz/getusertitleurl?access_token=${this.data.access_token}`,
        data: {
          title: username,
          tax_no: '',
          phone: '',
          bank_type: '',
          bank_no: ''
        },
        method: 'POST', 
        success: function(res){
          console.log(res);
        },
        fail: function(res) {
          console.log(res);
        }
      })
    }
    
  },
  save: function () {
    wx.showToast({
      title: '已发送'
    });
  },
  getTitle: function () {
    wx.showLoading();
    const _this = this;
    wx.chooseInvoiceTitle({
      success(res) {
        let { type, title, taxNumber, telephone, bankName, bankAccount } = res;
        if (type == 0) {
          //  企业
          _this.setData({
            type,
            title,
            taxNumber,
            company: title,
            telephone,
            bankName,
            bankAccount
          });
        } else {
          //  个人
          _this.setData({
            type,
            username: title
          });
        }
      },
      complete(res) {
        wx.hideLoading();
      }
    })


    // wx.chooseInvoiceTitle({
    //   success(res) {
    //     console.log(res);
    //   }
    // })
  }
})