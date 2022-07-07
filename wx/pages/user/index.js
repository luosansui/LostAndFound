// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    count: [0, 0, 0],
    labels: ['失物招领', '已被认领', '最近浏览'],
    refreshState: false
  },
  goList(e) {
    const id = e.mark.id
    if (typeof id !== 'number') return
    console.log(e.mark.id);
    ;(async()=>{
      const app =getApp()
      const res = await app.request('/api/user/info/user-object',{
        page: id
      })
      if(!res){
        wx.showToast({
          title: '未知错误',
          icon: 'error'
        })
        return
      }
      const nav = await wx.navigateTo({
        url: '/pages/list/index'
      })
      res.data.title = this.data.labels[id]
      nav.eventChannel.emit('setData', res.data)
    })()
  },
  goInfo() {
    ;
    (async () => {
      wx.showToast({
        title: '资料暂不可修改',
        icon: 'error'
      })
    })()
  },
  refresh() {
    ;
    (async () => {
      this.setData({
        refreshState: true
      })
      await this.onLoad()
      await new Promise(res=>setTimeout(()=>res(),2000))
      this.setData({
        refreshState: false
      })
    })()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //判断登录态
    if (!wx.getStorageSync('jwt')) {
      wx.reLaunch({
        url: '/pages/login/index'
      })
      return
    }
    //从缓存中拉取个人信息
    this.setData({
      info: wx.getStorageSync('info').user
    })
    //获取相关信息数量
    const app = getApp()
    const res = await app.request('/api/user/info/user-count', '', 'GET')
    if (!res) return
    console.log(res);
    //处理
    const {
      release: [{
        count: release
      }, ...claim],
      footmark
    } = res.data
    this.setData({
      count: [release, claim.reduce((p, c) => p.count + c.count), footmark]
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
    getApp().getCurrentTabbar(2, this)
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