// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    list: [],
    activeTab: 0,
    activeChip: 0,
    activeChipBox: false,
    request: false,
    requestLock: false,
    refreshState: false
  },
  tabSelect(e) {
    this.setData({
      activeTab: e.mark.tabi,
      activeChip: 0
    })
    //this._getListInfo()
  },
  chipSelect(e) {
    if (e.mark.chipi === undefined) return
    this.setData({
      activeChip: e.mark.chipi
    })
  },
  chipSlideToggle() {
    this.setData({
      activeChipBox: !this.data.activeChipBox
    })
  },
  goDetails(e) {
    ;(async()=>{
      const res = await wx.navigateTo({
        url: `/pages/details/index?id=${e.target.dataset.id}`
      })
      const { list,activeTab } = this.data
      res.eventChannel.emit('setData', { info: list[activeTab][e.target.dataset.index] })
    })()
  },
  goSearch() {
    wx.navigateTo({
      url: `/pages/search/index`
    })
  },
  goBtm() {
    ;
    (async () => {
      if (this.data.requestLock || this.data.request) return
      this.data.request = true
      const activeTab = this.data.activeTab
      const nowCampus = this.data.info[activeTab]
      const nowList = this.data.list[activeTab]
      if (nowList.length === 0) return
      console.log('触底请求');
      const res = await getApp().request('/api/user/info/index/list', {
        cid: nowCampus.cid,
        min: nowList[nowList.length - 1].id
      })
      //如果无新信息就禁用请求
      const arr = this.handleList(res.data)[0]
      if (arr.length === 0) {
        this.data.requestLock = true
        return
      }
      //增添新卡片
      this.setData({
        ["list[" + activeTab + "]"]: nowList.concat(arr)
      })
      this.data.request = false
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
  handleList(list){
    const app = getApp()
    const temp = []
    list.forEach(c => {
      const tempCampus = []
      const [root,] = app.globalData.imgUploadUrl
      c.forEach(p => {
        p.Po.forEach(o => {
          typeof o.image === 'string' && (o.image = JSON.parse(o.image))
          if(o.image.length){
            o.image = o.image.map(i=>`${root}${ i }`)
          }else{
            o.image.push(`${root}/image/default/cover.jpg`)
          }
          o.location = {
            lay: p.lay,
            loc: p.loc
          }
          tempCampus.push(o)
        })
      })
      temp.push(tempCampus.sort((a,b)=>b.id-a.id))
    })
    console.log(temp);
    return temp
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
    console.log("load")
    const app = getApp()
    //获取list
    const list = await app.request('/api/user/info/index/tip')
    console.log(list);
    if (!list) {
      wx.showToast({
        title: '出现未知错误',
        icon: 'error'
      })
      setTimeout(() => {
        wx.clearStorageSync()
        wx.reLaunch({
          url: '/pages/login/index',
        })
      }, 2000)
      return
    }

    //处理
    list.data.res.forEach(i => {
      i.tip.unshift('全部')
    })
    //渲染
    this.setData({
      info: list.data.res,
      list: this.handleList(list.data.list),
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
    /* getApp().globalData.selected = 0 */
    getApp().getCurrentTabbar(0, this)
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
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})