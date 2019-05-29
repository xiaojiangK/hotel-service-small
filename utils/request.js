const config = require('./../config/index');
const api = require('./api');

//  接口地址前缀
const baseURL = config.baseURL;

//  GET 请求
let get = (op = {}) => {
  return api.request({
    url: baseURL + op.path,
    ...op,
    header: {
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
      ...op.header
    },
    method: 'POST'
  }).then(res => {
    return res.data;
  });
};

/*
 *  发票
 *  发票抬头搜索
 */
exports.searchTitle = data => {
  return get({
    path: 'app/index.php?i=4&t=1&v=1.0.0&from=wxapp&c=entry&a=wxapp&do=getCompanySearch&m=zh_jdgjb',
    data: {
      ...data
    }
  })
};

/*
 *  发票
 *  申请开票
 */
exports.applyInvoice = data => {
  return post({
    path: 'app/index.php?i=4&t=1&v=1.0.0&from=wxapp&c=entry&a=wxapp&do=applyReceipt&m=zh_jdgjb',
    data: {
      ...data
    }
  })
};

/*
 *  发票
 *  获取最后申请的发票信息
 */
exports.getLastInvoice = data => {
  return get({
    path: 'app/index.php?i=4&t=1&v=1.0.0&from=wxapp&c=entry&a=wxapp&do=getLastRepeict&m=zh_jdgjb',
    data: {
      ...data
    }
  })
};
