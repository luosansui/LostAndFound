// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolList: [{
      id: "",
      name: "Loading",
      Sc: [{
        name: 'Loading',
        cu: []
      }]
    }],
    judgeRegisterData: [0],
    //两个值代表两个选项框
    pickVal: [0,0],
    pickscroll: [false,false],
  },
  /**滚动条事件 */
  pickerChange: function (e) {
    this.setData({
      ["pickVal["+e.target.dataset.id+"]"]: e.detail.value[0],
      ["pickscroll["+e.target.dataset.id+"]"]: false
    })
  },
  pickerStart: function (e) {
    this.setData({
      ["pickscroll["+e.target.dataset.id+"]"]: true
    })
  },
  pickerEnd: function (e) {
    this.setData({
      ["pickscroll["+e.target.dataset.id+"]"]: false
    })
  },
  //提交
  submit: function () {
    //保证滚动条非滚动状态
    const { schoolList,pickVal,pickscroll,judgeRegisterData:reg } = this.data
    const nowSchool = schoolList[pickVal[0]]
    const nowCampus = nowSchool.Sc[pickVal[1]]
    if (!nowSchool.id) {
      wx.showToast({
        title: '请稍等，加载中',
        icon: 'error'
      })
      return
    }else if (pickscroll.some(e=>e)) {
      wx.showToast({
        title: '请重试',
        icon: 'error'
      })
      return
    }
    //开始准备提交数据
    const app = getApp()
    ;(async () => {
      //获取用户昵称和头像作为用户初始头像和昵称
      const param = {
        sid: nowSchool.id
      }
      if (!reg[pickVal[0]]) {
        try {
          const user = await wx.getUserProfile({
            desc: '作为您的初始头像和昵称'
          })
          console.log(user);
          param.user = {
            image: user.userInfo.avatarUrl,
            name: user.userInfo.nickName
          }
          param.cid = nowCampus.id
        } catch (error) {
          console.log("error:", error);
          wx.showToast({
            title: '我们需要您的头像和昵称来注册账号',
            icon: 'none'
          })
          return
        }
      }

      //加载动画
      wx.showLoading({
        title: '登录中',
        mask: true
      })

      //获取code
      const code = await new Promise((res, rej) => {
        wx.login({
          timeout: 2000,
          success(_res) {
            res(_res)
          },
          complete(_res) {
            res(_res)
          }
        })
      })

      if (!code.code) {
        await wx.hideLoading()
        wx.showToast({
          title: 'code none',
          icon: 'error'
        })
      }

      param.code = code.code
      console.log(param);
      //提交请求
      const result = await app.request('/api/user/session/login', param, 'POST',false)
      if (!result) {
        await wx.hideLoading()
        wx.showToast({
          title: 'server Error',
          icon: 'error'
        })
      } else {
        wx.hideLoading()
        wx.setStorage({
          key: "jwt",
          data: result.data.message
        })
        wx.setStorage({
          key: "info",
          data: {
            'user': result.data.userInfo
          }
        })
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })()

  },
  async getCode() {
    //获取code
    const code = await new Promise(res => {
      wx.login({
        timeout: 2000,
        success(_res) {
          res(_res)
        },
        complete(_res) {
          res(_res)
        }
      })
    })
    if (!code.code) {
      await wx.hideLoading()
      wx.showToast({
        title: 'code none',
        icon: 'error'
      })
    } else {
      return code.code
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //隐藏home按钮
    if (wx.canIUse('hideHomeButton')) {
      wx.hideHomeButton()
    }
    //判断登录态
    if (wx.getStorageSync('jwt')) {
      wx.switchTab({
        url: '/pages/index/index'
      })
      return
    }
    /*获取学校列表*/
    ;
    (async () => {
      const app = getApp()
      const result = await app.request('/api/user/info/school', {
        code: await this.getCode()
      }, 'POST',false)
      if(!result)return
      /**渲染 */
      this.setData({
        schoolList: result.data,
        judgeRegisterData: result.data.map(s=>s.Sc.some(c=>c.Cu.length))
      })
      console.log('已获取学校列表',this.data.judgeRegisterData)
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