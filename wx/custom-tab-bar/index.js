// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  /**
   * 组件的初始数据
   */
  data: {
    "color": "#000000",
    "selectedColor": "#000000",
    "backgroundColor": "#000",
    "list": [{
      "pagePath": "pages/index/index",
      "iconPath": "/icon/home.png",
      "selectedIconPath": "/icon/home_selected.png",
      "text": "主页"
    }, {
      "pagePath": "pages/space/space",
      "iconPath": "/icon/submit.png",
      "iconPathClose": "/icon/submit_close.png",
      "isSpecial": true
    }, {
      "pagePath": "pages/user/index",
      "iconPath": "/icon/user.png",
      "selectedIconPath": "/icon/user_selected.png",
      "text": "个人"
    }],
    selected: 0,
    show: false,
    animationData: {},
    pageTime: 400
  },

  /**
   * 组件的方法列表
   */
  methods: {
/*     clickBtnLost(){
      this.toggleShowSelectPage(0,0)
      wx.navigateTo({
        url: '/pages/submit/index?id=1'
      })
    }, */
    switchTab(e) {
      const data = e.currentTarget.dataset
      if (!data.click) {
        const url = `/${data.path}`
        wx.switchTab({
          url
        })
      } else {
        this.toggleShowSelectPage()
      }
    },
    clickBtnFound(){
      this.toggleShowSelectPage(300,300)
      wx.navigateTo({
        url: '/pages/submit/index'
      })
    },
    toggleShowSelectPage(aniTime = 400,_pageTime = 400) {
      this.setData({
        pageTime: _pageTime,
        show: !this.data.show
      })
       /**旋转 */
       const Animation = wx.createAnimation({
        duration: aniTime,
        timingFunction: 'easeIn'
      })
      /**控制导航栏颜色及图标旋转 */
      if (this.data.show) {
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#FBBD08',
          animation: {
            duration: aniTime,
            timingFunc: 'easeIn'
          }
        })
        Animation.rotate(-45).step()
        this.setData({
          animationData: Animation.export(),
        })
      } else {
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff',
          animation: {
            duration: aniTime,
            timingFunc: 'easeIn'
          }
        })
        Animation.rotate(0).step()
        this.setData({
          animationData: Animation.export(),
        })
      }
    }
  }
})