// pages/home/home.js
import IMController from '../../controller/im.js'
import { connect } from '../../redux/index.js'

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newslist: {},
    banner: {},
    circle: {},
    placeholder:"搜索赫尔101",
    keyword:"",
    contentloaded: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: app.globalData.PAGE_CONFIG.appname+'刚更新了，是否重启？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
    if (!app.globalData.token && wx.getStorageSync('token')) {
      app.globalData.token = wx.getStorageSync('token');
      app.globalData.account = wx.getStorageSync('account');
      new IMController({
        token: wx.getStorageSync('token'),
        account: wx.getStorageSync('account')
      })
    
    wx.request({
      url: app.globalData.PAGE_CONFIG.ajaxBase + 'json_NIM_option.php',
      data: {},
      success: function (obj) {
        app.globalData.cansocial = obj.data.cansocial
      },
      header: {
        'Content-type': 'application/json'
      }
    })
    }
    var newslistUrl = app.globalData.PAGE_CONFIG.newslist
    var bannerUrl = app.globalData.PAGE_CONFIG.banner
    var circleUrl = app.globalData.PAGE_CONFIG.circle
     this.getMovieListData(circleUrl, 'circle');
     this.getMovieListData(bannerUrl,'banner');
     this.getMovieListData(newslistUrl, 'newslist');
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //wx.clearStorage();
    this.setData({
      newslist: {},
      banner: {},
      circle: {},
      contentloaded: 0
       })
    var newslistUrl = app.globalData.PAGE_CONFIG.newslist
    var bannerUrl = app.globalData.PAGE_CONFIG.banner
    var circleUrl = app.globalData.PAGE_CONFIG.circle
    this.getMovieListData(circleUrl, 'circle');
    this.getMovieListData(bannerUrl, 'banner');
    this.getMovieListData(newslistUrl, 'newslist');
    if (this.data.contentloaded == 1 || this.data.banner){
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
    }
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.handlelower()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var num = Math.floor(Math.random() * 12)
    var tt = ["赫尔101，连接一万个校友粉丝",
      "打开这个小程序只有0次和无数次",
      "赫尔101，内容引起舒适！",
      "真香警告，一天看八次赫尔101",
      "你已经是个成熟的Huller了，该学会使用赫尔101了",
      "小了白了兔，白了又了白，赫尔101点了开了来！",
      "我，赫尔101，点开，立刻转发去！",
      "我膨胀了，竟然点开了赫尔101",
      "只有我一人觉得赫尔101竟然有点好看吗",
      "赫尔圈不要扔，裹上蛋液过油炸，隔壁小孩都馋哭了",
      "嘤嘤嘤嘤，赫尔大学留学生社区终于开始公测了",
      "2019留学赫尔的新生都在这里，了解一下？"
    ]
    var clickurl = app.globalData.PAGE_CONFIG.click + "0"
    return {
      title: tt[num],
      path: '/pages/home/home',
      imageUrl: app.globalData.PAGE_CONFIG.download + "/images/wxshare-" + num + ".jpg",
      //imageUrl: '/statics/share.jpg',
      success: (res) => {
        wx.request({
          clickurl,
          method: 'GET',
          header: { 'content-type': 'json' },
          success: res => {
            console.log("转发成功", res);
          }
        })
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  //搜索
  input1(event) {
    var kw = event.detail.value
    this.setData({ keyword: kw })
  },
  bindToSearch(event) {
    var kw = event.detail.value || this.data.keyword 
    console.log(kw)
    if (kw.length<2){
      wx.showToast({
        title: '关键词太短了',
        icon: 'loading',
        duration: 2000
      })  
    }else{
    wx.navigateTo({
      url: '../movie-types/movie-types?kw=' + kw
    })

    }
  },
  getMovieListData(url, types) {
    var that=this
    var pageno = this.data[types].pageno || 1
    if (types == 'newslist') {
      url += '?pageno=' + pageno
    } else if (types == 'banner') {
      url += '?pageno=' + pageno
    } else if (types == 'circle') {
      url += '&pageno=' + pageno
    }
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
        
        
        var movies = this.data[types].movies || []
        var last = JSON.parse(subjects.pop())
        var totalp = last.totalp || 999
        var pageno = last.pageno
        var resArr = []
        
        subjects.forEach(item => {
          var jsonobj = JSON.parse(item);
          resArr.push({
            ...jsonobj
          })
        })
        movies = movies.concat(resArr)
        //this.setData({ [types]: [total, pageno, movies] })
        
        if (types == "newslist"){
          that.setData({ [types]: { totalp, pageno, movies } })
        } else {
          that.setData({
          [types]: {
            totalp, pageno, movies,
            autoplay: last.autoplay,
            interval: last.interval,
            duration: last.duration,
            indicatorDots: last.indicatorDots
          }
          })
        }
      },
      fail: err => console.log(err),
      complete() {
        wx.hideToast()
        that.setData({ contentloaded: 1})
      }
    })
  },

  
  handlelower() {
    var newslistUrl = app.globalData.PAGE_CONFIG.newslist 
    this.getMovieListData(newslistUrl,'newslist')
  },
  bindtodetail(event) {
    var id = event.currentTarget.dataset.id
    if(id>0){
      wx.navigateTo({
        url: '../movie-detail/movie-detail?id=' + id 
      })
    }else{
      wx.switchTab({
        url: '../rank/rank'
      })
    }
  }
})