// pages/movie-more/movie-more.js
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
    var id = options.id
    console.log(id)
     this.setData({
      winHeight:app.globalData.windowHeight,
      winWidth: app.globalData.windowWidth
     })
     if (id != '' && !isNaN(id)){
       this.getMovieListData(types,id)
      }else{
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
    var totalp = this.data[types].totalp || 9999
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
      header: { 'content-type':'json'},
      data:{
     
      },
      success:res => {
        var subjects = res.data.split("^")
        //console.log(res.data)
        
        var movies = this.data[types].movies || []
        //var news = JSON.parse(subjects[subjects.length-1])
        //var offset = this.data.offset || 0
        var last = JSON.parse(subjects.pop())
        var totalp = last.totalp || 999
        var pageno = last.pageno
        var resArr = []
        
        if (pageno != this.data[types].pageno) {
        
        console.log(subjects)
        //offset += subjects.length
        subjects.forEach(item => {
          var jsonobj = JSON.parse( item );
          resArr.push({
            ...jsonobj
          })
        })
        movies = movies.concat(resArr)
        this.setData({ [types]: { totalp,pageno,movies}})
        }
      },
      fail:err => console.log(err),
      complete(){
        wx.hideToast()
      }
    })
  },

  bindselect(event){
    var tabid = event.currentTarget.dataset.tabid
    if (tabid == 'newslist'){
      this.setData({
        shownewslist: true,
        showbanner: false,
      })
    } else {
      this.setData({
        shownewslist: false,
        showbanner: true,
      })
    }
    this.getMovieListData(tabid)
  },
  handlelower(){
    var types
    if (this.data.shownewslist){
      types = 'newslist'
    }else{
      types = 'banner'
    }
    
    var pg = this.data[types].pageno
    var tp = this.data[types].totalp
    console.log(tp + ',' + pg)
    if (tp >= pg ) {
    this.getMovieListData(types)
    }
  },
  bindtodetail(event){
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + id,
    })
  }
})