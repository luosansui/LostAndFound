// pages/setting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goService(){
    wx.showToast({
      title: '暂未接入客服',
      icon: 'error'
    })
  },
  goReserve(){
    wx.showToast({
      title: '功能未开通',
      icon: 'error'
    })
  },
  goQQ(){
    const code = '未定义'
   ;(async()=>{
    await wx.hideToast()
    const res = await wx.showModal({
      title:'BUG反馈群',
      content: code,
      cancelColor: '#888888',
      confirmText: '复制',
      confirmColor: '#FBBD08'
    })
    console.log(res);
    if(res.cancel) return
    wx.setClipboardData({
      data: code
    })

   })()

  },
  exit(){
    ;(async()=>{
      await wx.showLoading({
        title: '退出中',
        mask: true
      })
      wx.removeStorageSync('jwt')
      setTimeout(async i=>{
        await wx.hideLoading()
        wx.reLaunch({
          url: '/pages/login/index'
        })
      },1000)
    })()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('jwt')) {
      wx.reLaunch({
        url: '/pages/login/index'
      })
      return
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

  }
})