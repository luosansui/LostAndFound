// pages/developer/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[
      {
        name: '洛三岁',
        image: 'https://thirdqq.qlogo.cn/g?b=sdk&k=LGVxdAWAicKYFCiaZg2ibI7NQ&s=640',
        school: '上海海事大学',
        class: '计算机科学与技术191',
        sentence: '太阳出来我晒太阳，月亮出来我晒月亮咯',
        work: '系统开发',
        link: '2681684824'
      }
    ]
  },
  copyLink(e){
    const code = e.currentTarget.dataset.id
    ;(async()=>{
      await wx.hideLoading()
      const res = await wx.showModal({
        title:'复制QQ',
        content: code,
        cancelColor: '#FF8E3D',
        confirmText: '复制',
        confirmColor: '#2D82F4'
      })
      if(res.cancel) return
      wx.setClipboardData({
        data: code
      })
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