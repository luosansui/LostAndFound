// pages/message/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  goSession(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/session/index?id=${this.data.list[index].id}&name=${this.data.list[index].name}&image=${this.data.list[index].image}`,
    })
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
  retDate(nowdate) {
    return {
      y: nowdate.getFullYear(),
      m: nowdate.getMonth() + 1 < 10 ? '0' + (nowdate.getMonth() + 1) : nowdate.getMonth() + 1,
      d: nowdate.getDate() < 10 ? '0' + nowdate.getDate() : nowdate.getDate(),
      h: nowdate.getHours() < 10 ? '0' + nowdate.getHours() : nowdate.getHours(),
      mi: nowdate.getMinutes() < 10 ? '0' + nowdate.getMinutes() : nowdate.getMinutes(),
      s: nowdate.getSeconds() < 10 ? '0' + nowdate.getSeconds() : nowdate.getSeconds(),
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    console.log("message show");;
    (async () => {
      const res = await new Promise(res => {
        wx.request({
          url: `${getApp().globalData.url}/info/mess`,
          method: 'GET',
          header: {
            Authorization: `Bearer ${wx.getStorageSync('jwt')}`
          },
          success(_data) {
            res(_data)
          }
        })
      })
      console.log(res);
      if (res.statusCode !== 200 || res.data.errorCode) return
      //设置时间


      ///2022-01-15T15:25:58.000Z
      const now = this.retDate(new Date())
      res.data.forEach(e => {
        const str = this.retDate(new Date(e.time))
        if (str.y === now.y && str.m === now.m && str.d === now.d) {
          e.time = `今天 ${str.h}:${str.mi}`
        } else if (str.y === now.y) {
          e.time = `${str.m}/${str.d} ${str.h}:${str.mi}`
        } else {
          e.time = `${str.y}/${str.m}/${str.d} ${str.h}:${str.mi}`
        }
      })
      this.setData({
        list: res.data
      })
    })()
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