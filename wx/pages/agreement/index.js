// pages/agreement/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: [{
      name: 'h2',
      attrs: {
        class: 'agreement_title',
        style: ''
      },
      children: [{
        type: 'text',
        text: '失物招领平台用户协议'
      }]
    },{
      name: 'ol',
      attrs: {
        class: 'agreement_ol',
        style: ''
      },
      children: [{
        name: 'li',
        attrs: {
          class: 'agreement_li',
          style: ''
        },
        children: [{
          type: 'text',
          text: '用户在使用本平台时，不得有下列情形：'
        },{
          name: 'ol',
          attrs: {
            class: 'agreement_ol',
            type: 'I',
            style: ''
          },
          children: [{
            name: 'li',
            attrs: {
              class: 'agreement_li',
              style: ''
            },
            children: [{
              type: 'text',
              text: '违反宪法或法律法规规定的'
            }]
          },{
            name: 'li',
            attrs: {
              class: 'agreement_li',
              style: ''
            },
            children: [{
              type: 'text',
              text: '危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的'
            }]
          },{
            name: 'li',
            attrs: {
              class: 'agreement_li',
              style: ''
            },
            children: [{
              type: 'text',
              text: '损害国家荣誉和利益的，损害公共利益的'
            }]
          },{
            name: 'li',
            attrs: {
              class: 'agreement_li',
              style: ''
            },
            children: [{
              type: 'text',
              text: '煽动民族仇恨、民族歧视，破坏民族团结的'
            }]
          },{
            name: 'li',
            attrs: {
              class: 'agreement_li',
              style: ''
            },
            children: [{
              type: 'text',
              text: '破坏国家宗教政策，宣扬邪教和封建迷信的'
            }]
          },{
            name: 'li',
            attrs: {
              class: 'agreement_li',
              style: ''
            },
            children: [{
              type: 'text',
              text: '散布谣言，扰乱社会秩序，破坏社会稳定的'
            }]
          },{
            name: 'li',
            attrs: {
              class: 'agreement_li',
              style: ''
            },
            children: [{
              type: 'text',
              text: '散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的'
            }]
          },{
            name: 'li',
            attrs: {
              class: 'agreement_li',
              style: ''
            },
            children: [{
              type: 'text',
              text: '侮辱或者诽谤他人，侵害他人合法权益的'
            }]
          },{
            name: 'li',
            attrs: {
              class: 'agreement_li',
              style: ''
            },
            children: [{
              type: 'text',
              text: '含有法律、行政法规禁止的其他内容的'
            }]
          }]
        }]
      }]
    }]
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