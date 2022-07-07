// pages/details/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageId: '',
    allData: {
      user: {},
      info: {},
      labelData: []
    },
    label: ['物品编号','物品名称', '拾取地点', '放置地点', '拾取日期'],
    refreshState: false
  },
  goReport(e) {
    console.log(e.target.dataset.id);
    wx.showToast({
      title: '暂不支持举报',
      icon: 'none'
    })
  },
  claimObj() {
    const {
      location: {
        lay: name,
        loc
      }
    } = this.data.allData.info
    if (!name) {
      wx.showToast({
        title: '数据未载入',
        icon: 'error'
      })
      return
    }
    wx.openLocation({
      name,
      ...loc
    })
  },
  //用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: '失物招领',
      desc: '我发现一个物品，可能是你正在寻找的',
      path: `/pages/details/index?id=${this.data.pageId}`,
      imageUrl: this.data.allData.info?.image[0],
      toCurrentGroup: false
    }
  },
  refresh() {
    ;
    (async () => {
      console.log('刷新');
      this.setData({
        refreshState: true
      })
      await this.onLoad()
      await new Promise(res => setTimeout(() => res(), 2000))
      this.setData({
        refreshState: false
      })
    })()
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
    //获取物品id
    if (options?.id) this.data.pageId = options?.id
    const {
      pageId: id
    } = this.data
    if (!id) return
    //获取传递参数
    const eventChannel = this.getOpenerEventChannel()
    let getInfo = true
    let allData = {}
    //如果有页面传参
    if (options && eventChannel) {
      //不需获取用户信息
      getInfo = false
      //获取物品信息
      const data = await new Promise(res => {
        eventChannel.once('setData', function (data) {
          res(data?.info)
        })
      })
      allData.info = data
    }
    //获取用户信息和页面缺失的参数
    const app = getApp()
    const res = await app.request('/api/user/info/details-info', {
      id,
      getInfo
    })
    const {
      info: objInfo
    } = res.data
    //处理错误
    if (!res || objInfo?.id !== id) {
      wx.showToast({
        title: '未知错误',
        icon: 'error'
      })
      await new Promise(res => setTimeout(() => res(), 2000))
      wx.navigateBack()
      return
    }
    //数据处理
    const [root, ] = app.globalData.imgUploadUrl
    //设置数据
    if (getInfo){
      //处理image
      objInfo.image = objInfo.image.map(i => `${root}${i}`)
      allData.info = objInfo
    }
    allData.user = res.data?.user
    allData.labelData = [allData.info?.id,allData.info?.name, allData.info?.location?.lay, allData.info?.find?.name, allData.info?.time]
    console.log(allData);
    this.setData({
      allData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {

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

  }
})