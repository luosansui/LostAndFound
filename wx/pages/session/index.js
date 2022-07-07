// pages/session/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    otherInfo: {},
    myInfo: {},
    lists: [],
    chatVal: '',
    sending: false,
    i: {},
    btm: ''
  },
  sendChat() {
    console.log(this.data.chatVal);

    if (this.data.sending || !this.data.chatVal.trim()) {
      return
    } else {
      this.data.sending = true
    }
    //保留输入框内容并清空输入框
    const chatVal = this.data.chatVal
    this.setData({
      chatVal: '',
      lists: this.data.lists.concat({
        uid_A: this.data.myInfo.id,
        uid_B:  this.data.otherInfo.id,
        content: chatVal
      })
    })
    this.setData({
      btm: 'btm'
    })
    ;(async () => {
      console.log(this.data.otherInfo);
      const _res = await new Promise(res => {
        wx.request({
          url: `${getApp().globalData.url}/operate/chat`,
          method: 'POST',
          header: {
            Authorization: `Bearer ${ wx.getStorageSync('jwt') }`
          },
          data: {
            uid_B: this.data.otherInfo.id,
            content: chatVal
      },success(_data) {res(_data)}})})
      console.log(_res);

      if(_res.statusCode !== 200 || _res.data.errorCode){
        this.data.lists.pop()
        this.setData({
          lists: this.data.lists
        })
      }
      this.data.sending = false
     
    })()

  },
  //获取最新数据
  async getChats(offset = 0){
    const res = await new Promise(res => {
      wx.request({
        url: `${getApp().globalData.url}/info/chat`,
        method: 'POST',
        header: {
          Authorization: `Bearer ${ wx.getStorageSync('jwt') }`
        },
        data: {
          uid_B: this.data.otherInfo.id,
          offset: offset
    },success(_data) {res(_data)}})})
    console.log("轮询",res);
    if(res.statusCode === 200 && !res.data.errorCode && res.data.length !== 0){
      this.setData({
        lists: this.data.lists.concat(res.data),
        btm: 'btm'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    if (!wx.getStorageSync('jwt')) {
      wx.reLaunch({
        url: '/pages/login/index'
      })
      return
    }
    //页面参数
    console.log(opt);
    this.setData({
      otherInfo: opt,
      myInfo: wx.getStorageSync('userInfo')
    })
    wx.setNavigationBarTitle({
      title: opt.name
    })
    //获取全部最新数据
    this.getChats()
    //轮询数据
    const that = this
    this.data.i[0] = setInterval(()=>{
      if(!that.data.sending){
        that.getChats(that.data.lists.length)
      }
    },6000)
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
    console.log("卸载定时器",this.data.i[0]);
    clearInterval(this.data.i[0])
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

  }
})