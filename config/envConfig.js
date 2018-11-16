// 配置
let envir = 'online'
let ENVIRONMENT_CONFIG = {}
let configMap = {
    test: {
      appkey: 'fe416640c8e8a72734219e1847ad2547',
      url: 'https://apptest.netease.im'
    },

    pre: {
      //appkey: '45c6af3c98409b18a84451215d0bdd6e',
      appkey: '685896aa3848d377cca7b0c563958f7f',
      url: 'http://preapp.netease.im:8184'
    },
    online: {
      appkey: '685896aa3848d377cca7b0c563958f7f',
      url: 'https://app.netease.im'
    }
  };
ENVIRONMENT_CONFIG = configMap[envir];
// 是否开启订阅服务
ENVIRONMENT_CONFIG.openSubscription = true

module.exports = ENVIRONMENT_CONFIG