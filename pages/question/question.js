// pages/question/question.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    askslist: [],
    authorized: app.globalData.authorize,
    mainpic: app.globalData.PAGE_CONFIG.mainpic
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var askslistUrl = app.globalData.PAGE_CONFIG.askslist
    this.getMovieListData(askslistUrl, 'askslist');
    console.log(app.globalData.authorize) 
    this.setData({
      winHeight: app.globalData.windowHeight + 100,
      winWidth: app.globalData.windowWidth,
      authorized:app.globalData.authorize
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    return {
      title: '赫尔101的小问题',
      path: '/pages/question/question' ,
      imageUrl: app.globalData.PAGE_CONFIG.download + "/images/wxshare-7.jpg",
      //imageUrl: '/statics/share.jpg',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }

  },
  getMovieListData(url, types) {
    var that = this
    var pageno = this.data.pageno || 1
    
    console.log(url)
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })

    wx.request({
      url,
      method: 'GET',
      header: { 'content-type': 'json' },

      success: res => {
        
        var subjects = res.data.trim().split("^")
        
        var last = JSON.parse(subjects.pop())
        var totalp = last.totalp || 999
        var pageno = last.pageno
        var resArr = []
        var movies = that.data[types] || []
        subjects.forEach(item => {
          var jsonobj = JSON.parse(item);
          
          resArr.push({
            ...jsonobj
          })
        })
        movies = movies.concat(resArr)
        this.setData({ [types]:movies})
        if (pageno==2){
          this.setData({ totalp,pageno })
        }else{
          this.setData({pageno })
        }
        console.log(totalp)
        console.log(pageno)
        
        //that.setData({ askslist: movies })

       
      },
      fail: err => console.log(err),
      complete() {
        wx.hideToast()
        that.setData({ contentloaded: 1 })
      }
    })
  },



  //提交答案
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.showToast({
      title: '上传中',
      icon: 'loading',
      duration: 2000
    })
    wx.request({
      url: app.globalData.PAGE_CONFIG.answerurl,
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: e.detail.value,
      success: res => {
        if(res.data){
          wx.showModal({
            title: '提示',
            content: res.data +'要不要看看其他小伙伴的成绩？',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../rank/rank'
                })
              } else {
                console.log('用户点击取消')
              }

            }
          })
        }else{
          wx.showToast({
            title: '网络不畅',
            icon: 'loading',
            duration: 2000
          })
        }
      },
      fail: err => console.log(err),
      complete() {
        wx.hideToast()
      }
    })
  },

  handlelower(){
    var pg = this.data.pageno
    var tp = this.data.totalp
    var askslistUrl = app.globalData.PAGE_CONFIG.askslist + "&page=" + pg
    if (tp >= pg ) {
      this.getMovieListData(askslistUrl, 'askslist');
    }  
    
  },
  input1(event) {
    var mobile = event.detail.value
    app.globalData.mobile = mobile
  },

  onGotUserInfo: function (e) {
    var kw = app.globalData.mobile
    console.log(kw)
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(kw)) {

      wx.showToast({
        title: '手机号有误',
        icon: 'loading',
        duration: 2000
      })
    } else {
      app.globalData.authorize = 1
      
      
        if (e.detail.userInfo != null) {    //用户点击允许授权
          app.globalData.imageUrl = e.detail.userInfo.avatarUrl
          app.globalData.nickname = e.detail.userInfo.nickname
          this.setData({
            authorized: 1,
            imageUrl: e.detail.userInfo.avatarUrl,
            nickname: e.detail.userInfo.nickname,
            mobile:kw
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '请允许获取昵称和头像。',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../question/question'
                })
              } else {
                console.log('用户点击取消')
              }

            }
          })
        }
    }
  }

})