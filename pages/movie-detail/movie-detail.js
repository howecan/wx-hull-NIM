// pages/movie-detail/movie-detail.js

var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      movies:[],
      imgarr:[],
      poster: app.globalData.PAGE_CONFIG.download + "/images/wx-banner.jpg",
      article:'',
      imglist:'',
      jumpurl:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this
     var id = options.id
    var url = app.globalData.PAGE_CONFIG.subject + id
     console.log(url)
     wx.showToast({
       title:'加载中',
       icon:'loading',
       duration:10000
     })
     wx.request({
       url,
       method:'GET',
       header:{'content-type':'json'},
       success:res => {
         
         var lists = res.data.split("^")
         //console.log(lists)
         var movies = this.data.movies || []
         var last = JSON.parse(lists.pop())
         //var total = last.length || 6
         var title = last.title
         var body = this.strdecode(last.body)
         var imgs = this.strdecode(last.imgs)
         var writer = last.writer
         var coverimg = last.source
         var typename = last.typename
         var typeid = last.typeid
         var pubdate = last.pubdate
         var jumpurl = last.url
         
         var resArr = []
         console.log(jumpurl)
         
         lists.forEach(item => {
           var jsonobj = JSON.parse(item);
           resArr.push({
             ...jsonobj
           })
         })
         movies = movies.concat(resArr)
         this.setData({ id, title, writer, coverimg, typename, typeid, pubdate, jumpurl, movies })
         WxParse.wxParse('article', 'html', body, that, 0)
         
         if(imgs != ''){
            WxParse.wxParse('imglist', 'html', imgs, that, 0)
         }
       },
       fail: err => console.log(),
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

  //图片点击预览、长按转发、保存、识别图中二维码
  previewImage: function (e) {
    var imgarr = this.data.imgarr.concat(this.data.poster)
    console.log(imgarr)
    wx.previewImage({
      current: this.data.poster, // 当前显示图片的链接   
      urls: imgarr // 需要预览的图片链接列表数组   
    })
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var title = this.data.title
    var id = this.data.id
    var coverimg
    var clickurl = app.globalData.PAGE_CONFIG.click + id
    if (this.data.coverimg!=''){
       coverimg = this.data.coverimg
    }else{
      coverimg = this.data.imgarr[0]||"/images/wxshare-11.jpg"
    }
    console.log(coverimg)
    return {
      title: title,
      path: '/pages/movie-detail/movie-detail?id=' + id,
      imageUrl: app.globalData.PAGE_CONFIG.download + coverimg,
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

  bindtodetail(event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + id
    })
  },
  bindtotype(event){
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../movie-types/movie-types?id=' + id
    })
  }, 
  bindtohome(event){
    wx.switchTab({
      url: '../home/home' 
    })
  },
  bindtodownload(event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../casts-detail/casts-detail?id=' + encodeURI(id)
    })
  },
  wxParseTagATap(event) {
    var nowUrl = event.currentTarget.dataset.src;
    wx.navigateTo({
      url: '../casts-detail/casts-detail?url=' + encodeURI(nowUrl)
    })

  },
  utf8to16: function (str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
      c = str.charCodeAt(i++);
      switch (c >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += str.charAt(i - 1);
          break;
        case 12: case 13:
          // 110x xxxx   10xx xxxx
          char2 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = str.charCodeAt(i++);
          char3 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0));
          break;
      }
    }
  return out;
  },

  base64decode: function (str) {
    var base64DecodeChars = new Array(
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
      -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
      -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
      /* c1 */
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c1 == -1);
      if (c1 == -1)
        break;
      /* c2 */
      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c2 == -1);
      if (c2 == -1)
        break;
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
      /* c3 */
      do {
        c3 = str.charCodeAt(i++) & 0xff;
        if (c3 == 61)
          return out;
        c3 = base64DecodeChars[c3];
      } while (i < len && c3 == -1);
      if (c3 == -1)
        break;
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
      /* c4 */
      do {
        c4 = str.charCodeAt(i++) & 0xff;
        if (c4 == 61)
          return out;
        c4 = base64DecodeChars[c4];
      } while (i < len && c4 == -1);
      if (c4 == -1)
        break;
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
  },
  strdecode: function (str) {
    return this.utf8to16(this.base64decode(str));
  }

})