// pages/movie-types/movie-types.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showintheaters:true,
    showcomingsoon:false,
    newslist:{},
    banner:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var types = options.types || "newslist"
    var keyword = options.kw 
    var id = options.id
    console.log(keyword)
     this.setData({
      winHeight:app.globalData.windowHeight * 1.2,
       winWidth: app.globalData.windowWidth * 1.2
     })
     if (id != '' && !isNaN(id)){//搜栏目
              this.setData({
                shownewslist: true,
                showbanner: false,
                types: 'newslist'
              })
              this.getMovieListData(types,id)

     } else if (keyword != '') {//关键词
              this.setData({
                shownewslist: true,
                showbanner: false,
                types: 'newslist'
              })
              this.getSearchData(keyword)
      }else{//最新
              if (types == 'newslist'){
                this.setData({
                  shownewslist:true,
                  showbanner:false,
                  types: 'newslist'
                })
              }else{
                  this.setData({
                    shownewslist: false,
                    showbanner: true,
                    types:'banner'
                  })
              }
              this.getMovieListData(types)
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
  
  },
  getMovieListData(types,id){
    //var offset = this.data[types].offset || 0
    var pageno = this.data[types].pageno || 1
    var totalp = this.data[types].totalp || 999
    var url = app.globalData.PAGE_CONFIG.ajaxBase 
    //if(offset >= total){
    //  return
    //}
    if (id>0){
      url = app.globalData.PAGE_CONFIG.newslist + '?id=' + id + '&pageno=' + pageno
    }else if (types == 'newslist'){
      url = app.globalData.PAGE_CONFIG.newslist + '?pageno=' + pageno
    } else if (types == 'banner'){
      url = app.globalData.PAGE_CONFIG.banner +'?pageno=' + pageno
    }
    wx.showToast({
      title:'加载中',
      icon:'loading',
      duration:10000
    })

    wx.request({
      url,
      method:'GET',
      header: { 'content-type': 'json'},
      data:{
     
      },
      success:res => {
        var subjects = res.data.split("^")
        
        var movies = this.data[types].movies || []
        var last = JSON.parse(subjects.pop())
        var totalp = last.totalp || 999
        var pageno = last.pageno
        
        var resArr = []
        //console.log(subjects)
     
        subjects.forEach(item => {
          var jsonobj = JSON.parse( item );
          resArr.push({
            ...jsonobj
          })
        })
        if (resArr != false) { 
          var typename = resArr[0].typename
        }
        movies = movies.concat(resArr)
        this.setData({ [types]: { totalp, pageno,typename,id,movies}})

      },
      fail:err => console.log(err),
      complete(){
        wx.hideToast()
      }
    })
  },

  getSearchData(kw) {
    var types =  "newslist"
    var pageno = this.data[types].pageno || 1
    var totalp = this.data[types].totalp || 999
    var url = app.globalData.PAGE_CONFIG.searchURL + encodeURI(kw) + "&page=" + pageno
    console.log(url)
    this.setData({[types]:{kw}})
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })

    wx.request({
      url,
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded'  },
      data: {

      },
      success: res => {
        console.log(res.data)
        var subjects = res.data.split("^")
        var movies = this.data[types].movies || []
        var last = JSON.parse(subjects.pop())
        var totalp = last.totalp || 999
        var typename = last.typename
        var pageno = last.pageno
        var id = 0
        var resArr = []

        subjects.forEach(item => {
          var jsonobj = JSON.parse(item);
          resArr.push({
            ...jsonobj
          })
        })

        movies = movies.concat(resArr)
        this.setData({ [types]: { totalp, pageno, typename, id, movies } })

      },
      fail: err => console.log(err),
      complete() {
        wx.hideToast()
      }
    })
  },

  handlelower(){
    var types
    if (this.data.shownewslist) {
      types = 'newslist'
    } else {
      types = 'banner'
    }
    var id = this.data[types].id
    var pg = this.data[types].pageno
    var tp = this.data[types].totalp
    console.log(tp + ',' + pg)
    if (tp >= pg && id>0){
        this.getMovieListData(types,id)
    } else if (tp >= pg && this.data[types].kw !='') {
        this.getSearchData(kw)
    }
  },
  bindtodetail(event){
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + id,
    })
  }
})