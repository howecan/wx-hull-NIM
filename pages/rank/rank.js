// pages/rank/rank.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranklist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    this.setData({
      winHeight: app.globalData.windowHeight-80,
      winWidth: app.globalData.windowWidth

    })
    var ranklistUrl = app.globalData.PAGE_CONFIG.ranklist
    this.getMovieListData(ranklistUrl, 'ranklist');
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
      title: '独秀答题，稳中带皮！赫尔101排行榜揭晓',
      path: '/pages/rank/rank',
      imageUrl: app.globalData.PAGE_CONFIG.download + "/images/wxshare-10.jpg",
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
        console.log(subjects)
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
        that.setData({ "ranklist": movies })
        that.setData({ totalp, pageno })
        console.log(movies)

      },
      fail: err => console.log(err),
      complete() {
        wx.hideToast()
        that.setData({ contentloaded: 1 })
      }
    })
  },
  bindtoquestion(event){
    wx.navigateTo({
        url: '../question/question'
      })
    },
  handleupper(){
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //wx.clearStorage();
    this.setData({
      ranklist: [],
      contentloaded: 0
    })
    var ranklistUrl = app.globalData.PAGE_CONFIG.ranklist
    this.getMovieListData(ranklistUrl, 'ranklist');
    if (this.data.contentloaded == 1) {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  },

  handlelower() {
    var pg = this.data.pageno
    var tp = this.data.totalp
    var ranklistUrl = app.globalData.PAGE_CONFIG.ranklist + "?page=" + pageno
    if (tp > pg) {
      this.getMovieListData(ranklistUrl, 'ranklist');
    }

  }
})