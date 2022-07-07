// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    local: [],
    net: [],
    value: '',
    find: true,
    requestLock: false
  },

  searchKeyWord(e) {
    const key = (e.mark.id || this.data.value).trim()
    if (key === '') return
    if(this.data.requestLock){
      wx.showToast({
        title: '搜索过于频繁',
        icon: 'loading'
      })
      return
    }
    this.data.requestLock = true
    //
    wx.showLoading({
      title: '正在搜索'
    })
    //设置数据
    const {
      local
    } = this.data
    const index = local.findIndex(e=>e === key)
    if(index !== -1){
      local.splice(index,1)
    }
    local.unshift(key)
    this.setData({
      local,
      value: ''
    })
    //搜索
    const app =getApp()
    ;(async()=>{
      const res = await app.request('/api/user/info/index/tip',{
        key
      })
      await wx.hideLoading()
      if(!res){
        wx.showToast({
          title: '未知错误',
          icon: 'error'
        })
        return
      }
      console.log(res);
      const nav = await wx.navigateTo({
        url: '/pages/list/index'
      })
      res.data.key = key
      res.data.title = key
      nav.eventChannel.emit('setData', res.data )
      await new Promise(res=>setTimeout(()=>res(),8000))
      this.data.requestLock = false
    })()
  },
  toggleFind() {
    this.setData({
      find: !this.data.find
    })
  },
  deleteSearch() {
    const chip = wx.getStorageSync('chip') || {}
    chip.local = []
    wx.setStorageSync('chip', chip)
    this.setData({
      local: []
    })
    wx.showToast({
      title: '已删除'
    })
    return
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
    //设置搜索标签
    let {
      local = [], net = []
    } = wx.getStorageSync('chip')
    let find = wx.getStorageSync('find')
    const update = wx.getStorageSync('update')
    if(find === '')find = true
    if(!update || (update && +new Date() - update >= 86400000))net = []
    this.setData({
      local,
      net,
      find
    })

    if (find && !net.length) {
      console.log('请求');
      const app = getApp()
      const res = await app.request('/api/user/info/search-tip', '', 'GET')
      if (!res) return
      console.log(res);
      this.setData({
        net: res.data?.tip
      })
      wx.setStorageSync('update', +new Date())
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
    console.log('hide');
    this.onUnload()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('unload');
    const chip = wx.getStorageSync('chip') || {}
    chip.local || (chip.local = [])
    chip.net || (chip.net = [])
    const {
      local,
      net,
      find
    } = this.data
    let change = false
    if (chip.local.length < local.length) {
      chip.local = local
      change = true
    }
    if (net.length && (chip.net.length !== net.length || chip.net.some((v, i) => v.name !== net[i].name || v.count !== net[i].count))) {
      chip.net = net
      change = true
    }
    //根据此时的data设置缓存
    if (change) {
      wx.setStorageSync('chip', chip)
      console.log('设置缓存', chip);
    }
    wx.setStorageSync('find', find)
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