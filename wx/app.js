// app.js
App({
  onLaunch() {},
  globalData: {
    /**域名*/
    url: 'http://127.0.0.1:3000',
    imgUploadUrl: ['http://127.0.0.1:3000', '/api/serve/img/upload']
  },
  //设置tabbar的选中
  getCurrentTabbar(selected, that) {
    if (typeof that.getTabBar === 'function' &&
      that.getTabBar()) {
      that.getTabBar().setData({
        selected: selected
      })
    }
  },
  //提交请求
  request(url, data, method = 'POST', flag = true) {
    url = `${this.globalData.url}${url}`
    const requestObj = {
      url,
      method,
      data
    }
    if (flag) requestObj.header = {
      Authorization: `Bearer ${wx.getStorageSync('jwt')}`
    }
    return new Promise(res => {
      wx.request({
        ...requestObj,
        success(_data) {
          if (_data.statusCode !== 200 || _data.data.errorCode || (flag && _data.data === 'Authentication Error')) {
            console.log('请求错误', _data)
            res()
          }
          res(_data)
        },
        fail() {
          res()
        }
      })
    })
  },
  upload(filePath, url = this.globalData.imgUploadUrl.join(''), flag = true) {
    const requestObj = {
      url,
      filePath,
      name: 'img',
    }
    if (flag) requestObj.header = {
      Authorization: `Bearer ${wx.getStorageSync('jwt')}`
    }
    return new Promise(res => {
      wx.uploadFile({
        ...requestObj,
        success(data) {
          try {
            if (typeof data.data === 'string') data.data = JSON.parse(data.data)
          } catch (error) {
            console.log(error);
            res()
          }
          if (data.statusCode !== 200 || data.data.errorCode) {
            console.log('请求错误', data)
            res()
          }
          res(data)
        },
        fail() {
          res()
        }
      })
    })
  }

})