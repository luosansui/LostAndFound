// pages/submit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //限制日期
    endDate: '',
    //可选项列表
    listArray: {
      branch: [],
      data: []
    },
    listClick: [false, false, false],
    listIndex: [0, 0, 0],
    //拾取地点
    addr: {},
    auth: true,
    //拾取时间
    time: '',
    //描述
    details: '',
    //是否同意上传图片
    checked: false,
    //选择图片
    tempFilePath: []
  },
  /**选择校区 */
  selectBranch(e) {
    this.setData({
      ["listIndex[0]"]: e.mark.branchi,
      addr: {}
    })
  },
  /**物品名称 */
  pickerName(e) {
    if (!this.data.listClick[1]) {
      this.setData({
        ["listClick[1]"]: true
      })
    }
    this.setData({
      ["listIndex[1]"]: e.detail.value
    })
  },
  /**地图相关 */
  async selectPosition() {
    //要求未授权用户再次授权
    if (!this.data.auth) {
      const aut = await wx.openSetting()
      if (aut.authSetting["scope.userLocation"] === false) {
        return
      } else {
        this.data.auth = true
      }
    }
    //选择
    try {
      const local = this.data.listArray.data[this.data.listIndex[0]].location
      if (!local) return
      this.data.addr = await wx.chooseLocation(local)
    } catch (error) {
      wx.showToast({
        title: '取消选择',
        icon: 'error'
      })
      return
    }
    /**修改对象 */
    delete this.data.addr.errMsg
    console.log(this.data.addr)
    /**渲染到页面 */
    if (this.data.addr.name) {
      this.setData({
        addr: this.data.addr,
      })
    } else {
      wx.showToast({
        title: '未选中,请重试',
        icon: 'error'
      })
      return
    }


  },
  /**放置地点 */
  pickerLay(e) {
    if (!this.data.listClick[2]) {
      this.setData({
        ["listClick[2]"]: true
      })
    }
    this.setData({
      ["listIndex[2]"]: e.detail.value
    })
  },
  /**选择日期 */
  pickerDate(e) {
    this.setData({
      time: e.detail.value
    })
  },
  //选择协议
  checkedUploadImg() {
    this.setData({
      checked: !this.data.checked
    })
  },
  /**选择图片 */
  chooseImage() {
    if (!this.data.checked) {
      wx.showToast({
        title: '请同意协议',
        icon: 'error'
      })
      return
    };
    (async () => {
      const that = this
      const res = await wx.chooseMedia({
        count: 3
      })
      that.setData({
        tempFilePath: res.tempFiles
      })
    })()
  },
  errorInfo(text) {
    wx.showToast({
      title: text,
      icon: 'error'
    })
  },
  submitInfo() {
    const index = this.data.listIndex
    const nowList = this.data.listArray.data[index[0]]
    if (!nowList) {
      wx.showToast({
        title: '未加载完成',
        icon: 'error'
      })
      return
    }
    //获取数据
    const param = {
      name: this.data.listClick[1] && nowList.tip[index[1]],
      address: this.data.addr.name && this.data.addr,
      lay: this.data.listClick[2] && nowList.Cp[index[2]].id,
      time: this.data.time,
      details: this.data.details,
      img: this.data.checked && this.data.tempFilePath
    }
    console.log(8, param);
    //检查参数
    const paramKeys = Object.keys(param)
    for (let i = 0; i < paramKeys.length; i++) {
      const key = paramKeys[i]
      const e = param[key]
      //不检查details,对img特别检查
      if (key === 'details') continue
      else if (key === 'img') {
        if (e === false) continue
        else if (e.length === 0) {
          this.errorInfo('请选择图片')
          return
        }
      }
      switch (typeof e) {
        case 'string':
          if (e.trim() === '') {
            this.errorInfo('请保证信息完整')
            return
          }
          break;
        case 'object':
          if (Object.keys(e).length === 0) {
            this.errorInfo('请保证信息完整')
            return
          }
          break;
        case 'boolean':
          if (!e) {
            this.errorInfo('请保证信息完整')
            return
          }
          break;
        case 'undefined':
          if (!e) {
            this.errorInfo('请保证信息完整')
            return
          }
          break;
      }
    }
    //提交数据
    const app = getApp();
    (async () => {
      //提交图片
      if (param.img) {
        wx.showLoading({
          title: '正在上传图片',
          mask: true
        })
        const img_upload_res = (await Promise.all(param.img.map(i => app.upload(i.tempFilePath)))).map(u => u && u.data.url[0].src).filter(e => e)
        wx.hideLoading()
        if (!img_upload_res.length) {
          wx.showToast({
            title: 'upload error',
            icon: 'error'
          })
          return
        }
        param.img = img_upload_res
      }
      //提交信息
      wx.showLoading({
        title: '正在提交',
        mask: true
      })
      const res = await app.request('/api/user/operate/submit-object-info', param)
      if (!res) {
        wx.showToast({
          title: 'server Error',
          icon: 'error'
        })
        return
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
          mask: true
        })
        //跳转
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 1000)
      }
    })()
  },
  //获取当前日期
  getYYMMDD() {
    const nowdate = new Date()
    const timeArr = [nowdate.getFullYear(),
      nowdate.getMonth() + 1 < 10 ? '0' + (nowdate.getMonth() + 1) : nowdate.getMonth() + 1,
      nowdate.getDate() < 10 ? '0' + nowdate.getDate() : nowdate.getDate()
    ]
    return timeArr.join('-')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    //判断登录态
    if (!wx.getStorageSync('jwt')) {
      wx.reLaunch({
        url: '/pages/login/index'
      })
      return
    }
    this.setData({
      endDate: this.getYYMMDD()
    })
    /**获取物品列表 */
    ;
    (async () => {
      //要求用户授权
      try {
        await wx.authorize({
          scope: 'scope.userLocation'
        })
      } catch (error) {
        wx.showToast({
          title: '未授权地理位置',
          icon: 'error'
        })
        this.data.auth = false
      }
      const app = getApp()
      const list = await app.request('/api/user/info/submit-list', '', 'GET')
      if (!list) {
        wx.showToast({
          title: 'server Error',
          icon: 'error'
        })
        return
      }
      console.log(list);
      this.setData({
        ["listArray.branch"]: list.data.map(o => o.branch),
        ["listArray.data"]: list.data,
      })
    })()

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