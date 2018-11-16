import IMController from '../../controller/im.js'
import { connect } from '../../redux/index.js'
let app = getApp()
let store = app.store
let pageConfig = {
  data: {
    account: '',// 用户输入账号
    password: '',//用户输入密码
    avatorUrl: app.globalData.avatarUrl||'/images/default.png',
    openId:'',
    nickname: app.globalData.nickname||'未登录',
    canclick:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 测试使用
  onLoad() {
    this.resetStore()
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  onShow() {
    this.resetStore()
  },
  /**
   * 重置store数据
   */
  resetStore: function () {
    store.dispatch({
      type: 'Reset_All_State'
    })
  },
  /**
   * 用户输入事件：dataset区分输入框类别
   */
  inputHandler: function (e) {
    let temp = {}
    temp[e.currentTarget.dataset.type] = e.detail.value
    this.setData(temp)
  },
  handler: function (e) {
    if (e.detail.authSetting["scope.userInfo"]) {//如果允许授权，就会为true
      this.setData({
        canIUse: true
      })
    }
  },
  gotohome:function(){
    wx.switchTab({
      url: '../home/home'
    })
  },
  /**
   * 单击注册:跳转注册页
   */
  registerTap: function () {
    //登录微信获取昵称头像openid
    wx.login({
      success: function (res) {
        wx.showToast({
          title: '正在跳转',
          icon: 'loading',
          duration: 3000
        })
        console.log("微信登录返回")
        console.log(res)
        if (res.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res_user) {
              
              wx.request({
                //后台接口地址
                url: app.globalData.PAGE_CONFIG.ajaxBase + 'json_wxlogin.php',
                data: {
                  code: res.code,
                  encryptedData: res_user.encryptedData,
                  iv: res_user.iv
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  // this.globalData.userInfo = JSON.parse(res.data);
                  
                    app.globalData.nickname= res.data.nickName;
                    app.globalData.avatarUrl= res.data.avatarUrl;
                    app.globalData.openId= res.data.openId;
                  console.log("微信昵称:" + app.globalData.nickname)
                  wx.navigateTo({
                    url: '../register/register',
                  })
                 
                }
              })
            }, fail: function () {
              wx.showModal({
                title: '警告通知',
                content: '您点击了拒绝授权,将无法注册,点击确定重新获取授权。',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                          wx.login({
                            success: function (res_login) {
                              if (res_login.code) {
                                wx.getUserInfo({
                                  withCredentials: true,
                                  success: function (res_user) {
                                    wx.request({
                                      url: app.globalData.PAGE_CONFIG.ajaxBase + 'json_wxlogin.php',
                                      data: {
                                        code: res_login.code,
                                        encryptedData: res_user.encryptedData,
                                        iv: res_user.iv
                                      },
                                      method: 'GET',
                                      header: {
                                        'content-type': 'application/json'
                                      },
                                      success: function (res) {
                                        app.globalData.nickname = res.data.nickname;
                                        app.globalData.avatarUrl = res.data.avatarUrl;
                                        app.globalData.openId = res.data.openId;

                                        wx.navigateTo({
                                          url: '../register/register',
                                        })
                                        
                                      }
                                    })
                                  }
                                })
                              }
                            }
                          });
                        }
                      }, fail: function (res) {

                      }
                    })

                  }
                }
              })
            }, complete: function (res) {
              
            }
          })
        }
      }


    })
    
  },
  /**
   * 执行登录逻辑
   */
  doLogin: function () {
    var that = this;

    if (this.data.password == "") {
      wx.showModal({
        title: "请输入密码！",
        confirmText: "OK",
        showCancel: false
      });
      return;
    };
    if (this.data.password == "0000") {//测试账号
      that.setData({
        nickname: "中国办公室",
        avatarUrl: "../../images/default.png",
        openId: "ovKS05JrxKTIZrryu67uJyGoDIxs",
        hasUserInfo: true,
        canClick: true,
        account:"chinaoffice",
        token:"111111"

      });

      
      app.globalData.token = that.data.password;
      app.globalData.account = that.data.account;
      wx.setStorageSync('token', that.data.token);
      wx.setStorageSync('account', that.data.account);
      wx.setStorageSync('openId', that.data.openId);
      new IMController({
        token: that.data.token,
        account: that.data.account
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../contact/contact'
        })
      }, 200)
    }
    else {
      wx.showToast({
        title: '登录中...',
        icon: 'loading',
        duration: 5000
      })
      var xcxlogin = function () {
        console.log("小程序开始登录")
        wx.request({
          //小程序登录
          url: app.globalData.PAGE_CONFIG.ajaxBase + 'json_NIM_xcxlogin.php',
          data: {
            nickname: that.data.nickname,
            openId: that.data.openId,
            password: that.data.password
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },

          success: function (res) {
            
            if (res.data != '0') {
              
              console.log("小程序登录成功account:" + res.data.account)
              app.globalData.token = res.data.token;
              app.globalData.account = res.data.account;
              wx.setStorageSync('token', res.data.token);
              wx.setStorageSync('account', res.data.account);
              that.setData({//真名
                account: res.data.account
              })
              new IMController({
                token: res.data.token,
                account: res.data.account
              })

              setTimeout(function () {
                wx.switchTab({
                  url: '../contact/contact'
                })
              }, 200)
            } else {
              
              wx.showToast({
                title: '密码有误',
                icon: 'loading',
                duration: 2000
              })
            }
          }
        })
      };

      wx.login({

        success: function (res) {
          
          if (res.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: function (res_user) {
                console.log(res_user)
                wx.request({
                  //微信登录
                  url: app.globalData.PAGE_CONFIG.ajaxBase + 'json_wxlogin.php',
                  data: {
                    code: res.code,
                    encryptedData: res_user.encryptedData,
                    iv: res_user.iv
                  },
                  method: 'GET',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    console.log("微信登录返回")
                    console.log(res.data)
                    that.setData({
                      openId: res.data.openId,
                      nickname: res.data.nickName,
                      avatarUrl: res.data.avatarUrl
                    })
                    app.globalData.nickname = res.data.nickName;
                    app.globalData.avatarUrl = res.data.avatarUrl;
                    app.globalData.openId = res.data.openId;
                    wx.setStorageSync('openId', res.data.openId);
                    xcxlogin();


                  }
                })
              }, fail: function () {
                wx.showModal({
                  title: '警告通知',
                  content: '您点击了拒绝授权,将无法正常使用校友圈功能。请点击授权设置按钮进行授权。',
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {
                          if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                            wx.login({
                              success: function (res_login) {
                                if (res_login.code) {
                                  wx.getUserInfo({
                                    withCredentials: true,
                                    success: function (res_user) {
                                      wx.request({
                                        url: app.globalData.PAGE_CONFIG.ajaxBase + 'json_wxlogin.php',
                                        data: {
                                          code: res_login.code,
                                          encryptedData: res_user.encryptedData,
                                          iv: res_user.iv
                                        },
                                        method: 'GET',
                                        header: {
                                          'content-type': 'application/json'
                                        },
                                        success: function (res) {
                                          that.setData({
                                            nickname: res.data.nickName,
                                            avatarUrl: res.data.avatarUrl,
                                            openId: res.data.openId
                                          })
                                          app.globalData.nickname = res.data.nickName;
                                          app.globalData.avatarUrl = res.data.avatarUrl;
                                          app.globalData.openId = res.data.openId;
                                          xcxlogin();
                                        }
                                      })
                                    }
                                  })
                                }
                              }
                            });
                          }
                        }, fail: function (res) {
                          
                        }
                      })

                    }
                  }
                })
              }, complete: function (res) {

              }
            })
          }
        }


      });

    }



    
  }
}
let mapStateToData = (state) => {
  return {
    isLogin: state.isLogin || store.getState().isLogin
  }
}
const mapDispatchToPage = (dispatch) => ({
  loginClick: function() {
    this.doLogin()
    return
  }
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)
