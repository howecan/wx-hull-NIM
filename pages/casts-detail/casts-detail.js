// pages/casts-detail/casts-detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showalldesc: false,
    winHeight:'',
    winWidth:'',
    url:'',
    src:'',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var url = options.url
    console.log('URL='+url)
    console.log('ID=' +id)
    if(id){
      this.setData({
        src: app.globalData.PAGE_CONFIG.download + id
    })
    
    }else if(url){
      this.setData({
        src: app.globalData.PAGE_CONFIG.ajaxBase + "getweb.php?url=" +url,
        url:url        
      })
      
    }
    
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
    var url
    if (this.Data.url){
      url = '?url='+this.Data.url
    } else if (this.Data.id){
      url = '?id=' +this.Data.id  
    }
    return {
      title: '赫尔大学商学院课程介绍',
      path: '/pages/casts-detail/casts-detail' + url,
      imageUrl: app.globalData.download+"/images/wxshare-6.jpg",
      //imageUrl: '/statics/share.jpg',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }

  },
  bindextension() {
    this.setData({
      showalldesc: true
    })
  },
  bindcastsdetail(event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + id,
    })
  }
})