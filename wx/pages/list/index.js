// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    list: [],
    key: '',
    activeTab: 0,
    request: false,
    requestLock: false,
  },
  tabSelect(e) {
    this.setData({
      activeTab: e.mark.tabi,
    })
  },
  goDetails(e) {
    ;
    (async () => {
      const res = await wx.navigateTo({
        url: `/pages/details/index?id=${e.target.dataset.id}`
      })
      const {
        list,
        activeTab
      } = this.data
      res.eventChannel.emit('setData', {
        info: list[activeTab][e.target.dataset.index]
      })
    })()
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
      const requestData = {
        cid: nowCampus.cid,
        min: nowList[nowList.length - 1].id,
      }
      if(this.data.key)requestData.key = this.data.key
      const res = await getApp().request('/api/user/info/index/list', requestData)
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
  handleList(list) {
    const app = getApp()
    const temp = []
    const [root, ] = app.globalData.imgUploadUrl
    list.forEach(c => {
      const tempCampus = []
      const campus = c.Cp || c
      campus.forEach(p => {
        p.Po.forEach(o => {
          typeof o.image === 'string' && (o.image = JSON.parse(o.image))
          o.image === null && (o.image = [])
          if (o.image.length) {
            o.image = o.image.map(i => `${root}${ i }`)
          } else {
            o.image.push(`${root}/image/default/cover.jpg`)
          }
          o.location = {
            lay: p.lay,
            loc: p.loc
          }
          tempCampus.push(o)
        })
      })
      temp.push(tempCampus.sort((a, b) => b.id - a.id))
    })
    console.log(temp);
    return temp
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if (!wx.getStorageSync('jwt')) {
      wx.reLaunch({
        url: '/pages/login/index'
      })
      return
    }
    console.log("load")
    //获取传递参数
    try {
      const eventChannel = this.getOpenerEventChannel()
      const data = await new Promise(res => {
        eventChannel.once('setData', function (data) {
          res(data)
        })
      })
      console.log(data, 999);
      let { res:info,list,key='',title } = data
      if(!info){
        info = list.map(c=>({ cid: c.cid,branch: c.branch }))
      }
      list = this.handleList(list)
      //渲染
      this.setData({
        info,
        list,
        key
      })
      title && wx.setNavigationBarTitle({
        title
      })
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '出现未知错误',
        icon: 'error'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
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
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})