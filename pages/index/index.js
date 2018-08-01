// pages/detail/index.js
var INFO = wx.getSystemInfoSync();
var { FAV, API } = getApp();
var weToast = require('../../libs/weToast/weToast.js');
var TOAST;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    date: [],
    btnList:[
      {
        id:1,
        isActive:true,
        name:'子 曰',
        url:'../../page/detail/index'
      },
      {
        id: 2,
        isActive: false,
        name: '吐 槽',
        url: '../../page/detail/index'
      },
      {
        id: 3,
        isActive: false,
        name: '神 迹',
        url: '../../page/detail/index'
      },
      ],
    // _item: '',
    LOADING: true,
    // 是否已经喜欢
    IS_LIKED: false,
    // 是否是点击分享进来的页面
    IS_SHARE_PAGE: false,
    SCROLL_TOP: 0,
    // 导航栏透明度
    opacity: 0,
    HEIGHT: INFO.windowHeight,
    STATUSBAR_HEIGHT: INFO.statusBarHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    TOAST = new weToast(this);
   
    new Promise(RES => {API.getDataById(4846).then(RES)}).then(item => {
      this.setData({
        data: item,
        date: item.date.split(' / '),
        // _item: encodeURIComponent(item),
        IS_LIKED: FAV.check(item.id),
        HEIGHT: wx.getSystemInfoSync().windowHeight,
        IS_SHARE_PAGE: getCurrentPages().length === 1
      });
      setTimeout(() => this.setData({ LOADING: false }), 500);
    });

    this.SHARE_IMG = null;
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.data.title,
      path: '/pages/index/index?id=' + this.data.data.id
    }
  },

  /**
   * 返回
   */
  goBackHandler: function () {
    wx.navigateBack({});
  },
  goHomeHandler: function () {
    wx.redirectTo({
      url: '/pages/home/index',
    })
  },
  /**
   * 预览图片
   */
  viewImageHandler: function (e) {
    vPush.add(e);
    var { url } = e.currentTarget.dataset;
    wx.previewImage({
      urls: [url],
    })
  },

  /**
   * 复制内容
   */
  copyHandler: function () {
    wx.setClipboardData({
      data: this.data.data.content,
    })
  },

  /**
   * vPush添加formId
   */
  addPushHandler: function (e) {
    vPush.add(e);
  },

  /**
   * 返回顶部
   */
  toTopHandler: function (e) {
    vPush.add(e);
    this.setData({
      SCROLL_TOP: 0
    })
  },

  /**
   * 滚动事件
   */
  scrollHandler: function (e) {
    var { scrollTop } = e.detail;
    // 计算透明度
    var opacity = parseFloat(scrollTop / 250).toFixed(2);
    if (opacity > 1) opacity = 1;
    if (opacity < 0.1) opacity = 0;
    // 这里设置<300是减少setData次数，节省内存
    if (scrollTop < 300) {
      this.setData({
        opacity
      })
    }
  },
  btnFun:function(event){
    let idx = event.target.dataset.index;
    this.data.btnList.forEach(function(item,_idx){
      item.isActive=false;
      if (_idx==idx){
        item.isActive=true;
      }
    });
    this.setData({
      btnList:this.data.btnList
    })
  }

})