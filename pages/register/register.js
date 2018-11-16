import { post, validStringType, showToast } from '../../utils/util.js'

import IMController from '../../controller/im.js'
import MD5 from '../../vendors/md5.js'
import { connect } from '../../redux/index.js'

let app = getApp()
let store = app.store

let pageConfig = {
  data: {
    nickname: "",
    avatarUrl: "",
    openId: "",
    account: '',//账号
    password: '',//密码
    // isRegister: false,//登录菊花,
    errorMessage: '',//提示错误信息
    canClick:true
  },
  onLoad() {
    this.setData({
      nickname: app.globalData.nickname || "注册会员",
      avatarUrl: app.globalData.avatarUrl || "../../images/default.png",
      openId: app.globalData.openId,
      gender: app.globalData.gender
    });
  },
  /**
   * 存储表单填入数据
   */
  inputHandler: function (e) {
    let temp = {}
    temp[e.currentTarget.dataset.type] = e.detail.value
    this.setData(temp)
  },

  /**
   * 执行注册逻辑
   */
  doRegister: function () {
    this.setData({
      canClick: false
    });
    let errortext = ''
    let username = this.data.account
    let nickname = this.data.nickname
    let password = this.data.password
    let that = this 
    
    if (!validStringType(nickname, 'string-number-hanzi')) {
      wx.showModal({
        title: '昵称限汉字、字母或数字',
        showCancel: false,
        confirmText: "OK"
      });
    }
    if ((password.length < 6) || !validStringType(password, 'string-number')) {
      wx.showModal({
        title: '密码限6~20位字母或数字',
        showCancel: false,
        confirmText: "OK"
      });
    }
    // 校验输入
    if (!validStringType(username, 'string-accid')) {
      wx.showModal({
        title: '账号限小写字母或数字@-_',
        showCancel: false,
        confirmText: "OK"
      });
    } else {//检验账号重复

      wx.request({
        url: app.globalData.PAGE_CONFIG.ajaxBase + 'json_NIM_account_test.php',
        data: {
          truename: username
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data == 1) {
            wx.showModal({
              title: "该账号已注册过了",
              showCancel: false,
              confirmText: "OK"
            });
            console.log('此账号已被注册')
            that.setData({
              canClick: true
            });
          }else{
            //--------------------------
            // 更新本地视图
            store.dispatch({
              type: 'Register_StartRegister'
            })
            // 发送请求
            console.log(errortext + "2")
            //注册小程序会员

            wx.request({
              url: app.globalData.PAGE_CONFIG.ajaxBase + 'json_NIM_register.php',
              data: {
                truename: that.data.account,
                password: that.data.password,
                nickname: that.data.nickname,
                avatarUrl: that.data.avatarUrl,
                openId: that.data.openId,
                gender: that.data.gender
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {//注册云信会员

                console.log(res)
                if (res.data == 1) {
                  console.log("服务器有点卡")
                  that.setData({
                    canClick: true
                  });
                  wx.showModal({
                    title: "服务器有点卡，稍后再试",
                    showCancel: false,
                    confirmText: "OK"
                  });
                  return
                } else if (res.data == 0) {
                  console.log("你已经注册过了")
                  wx.showModal({
                    title: "你已经注册过了",
                    showCancel: false,
                    confirmText: "OK"
                  });
                  return
                } else if (res.data.code == 414) {
                  console.log("该账号已注册")
                  wx.showModal({
                    title: "该账号注册过了",
                    showCancel: false,
                    confirmText: "OK"
                  });
                  return
                } else if (res.data.token > 0) {
                  console.log("注册成功")
                  app.globalData.token = res.data.token;
                  app.globalData.account = res.data.accid;
                  wx.setStorageSync('token', res.data.token);
                  wx.setStorageSync('openId', that.data.openId);
                  wx.setStorageSync('account', res.data.accid);
                  store.dispatch({
                    type: 'Register_RegisterSuccess'
                  })
                  new IMController({
                    token: res.data.token,
                    account: that.data.account
                  });
                  wx.showModal({
                    title: "注册成功",
                    content: "密码是" + that.data.password,
                    showCancel: false,
                    confirmText: "OK",
                    success(res) {
                      if (res.confirm) {
                        wx.switchTab({
                          url: '../contact/contact'
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  });

                } else {
                  store.dispatch({
                    type: 'Register_RegisterSuccess'
                  })
                  showToast('error', '注册失败，请重试！')
                  console.log(err)
                  // 给出本地出错提示
                  that.setData({
                    errorMessage: res.data,
                    canClick: true
                  })
                }

              },
              fail: function () {
                that.setData({
                  canClick: false,
                });
                wx.showModal({
                  title: "网络故障，稍后注册",
                  showCancel: false,
                  confirmText: "OK"
                });
              }
            })

            //--------------------------
          }
        }
      })
    }
   

    
    
  },

  /**
   * 单击登录,跳转到登录页
   */
  registerLoginTap: function () {
    wx.navigateBack({
      url: '../login/login',
    })
  }
}

let mapStateToData = (state) => {
  return {
    isRegister: state.isRegister || store.getState().isRegister
  }
}
const mapDispatchToPage = (dispatch) => ({
  registerSubmit: function () {
    this.doRegister()
    return
  }
})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)

Page(connectedPageConfig)
