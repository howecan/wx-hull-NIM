// pages/catalog/catalog.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    var url = app.globalData.PAGE_CONFIG.catalog
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
        var lists = res.data.split("^")
        console.log(lists)
        var lists = lists.map(function (item) {
          item = JSON.parse(item)
        
          //item.title = that.strdecode(item.title)
          return item
         
          //return that.strdecode(item)
        })
        console.log(lists)
        
        this.setData({lists})
        
      },
      fail: err => console.log(err),
      complete() {
        wx.hideToast()
      }
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
    var num = Math.floor(Math.random() * 11)
    return {
      title: '赫尔101，安排上了！',
      path: '/pages/catalog/catalog',
      imageUrl: app.globalData.download + "/images/wxshare-4.jpg",
      //imageUrl: '/statics/share.jpg',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }

  },
  bindtotype(event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../movie-types/movie-types?id=' + id
    })
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '02152342851',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  }
})