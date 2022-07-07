const router = require('@koa/router')()
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const path = require('path')
const xss = require("xss")
const connPromise = require('../utils/connectDB')
const __config__ = require('../utils/readConfig')

//登录 ok
router.post('/api/user/session/login', async (ctx, next) => {
    try {
        const { sid,code,user,cid:campusCid } = ctx.request.body
        //参数处理
        console.log(ctx.request.body);
        let check = false
        //uid和sid过滤
        if(
            campusCid && !/^\d+$/.test(campusCid.toString())
            || !/^\d+$/.test(sid.toString())
        )check = true
        //过滤user
        if(user){
            user.name = xss(user.name.trim())
            user.image = xss(user.image.trim())
        }
        let { name,image } = user || {}
        if(check){
            ctx.body = {
                errorCode: 1,
                message: '非法参数'
            }
            return
        }
        //换取openid
        const response = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${ __config__.wx.appid }&secret=${ __config__.wx.secret }&js_code=${ code }&grant_type=authorization_code`)
        const _data = await response.json();
        if (!_data.openid) throw new Error(JSON.stringify( _data ))
        /**查询或创建user表 */
        const uid = `${_data.openid}_${sid.toString().padStart(6,'0')}`
        const conn = await connPromise
        const res = await conn.models.user.findOrCreate({
            where: { uid },
            defaults: { uid,name,image,campusCid }
        })
        if(!res)throw new Error('未知错误')
        //使用该条目创建JWT
        const _jwt_user = __config__.jwt.user
        /**
         * iss: jwt签发者
         * sub: jwt所面向的用户
         * aud: 接收jwt的一方
         * exp: jwt的过期时间，这个过期时间必须要大于签发时间
         * nbf: 定义在什么时间之前，该jwt都是不可用的.
         * iat: jwt的签发时间
         */
         _jwt_user.payload.subject = JSON.stringify({ uid })
        /**生成jwt */
        const token = jwt.sign(_jwt_user.payload, _jwt_user.secret, _jwt_user.option)
        /**完成操作 */
        //返回JWT
        ctx.body = {
            errorCode: 0,
            message: token,
            userInfo: {
                id: uid,
                name: res[0].name,
                image: res[0].image,
                coin: res[0].coin
            }
        }
    } catch (error) {
        console.log("/api/user/session/login error ###",error.message);
        ctx.body = {
            errorCode: 1,
            message: error.message
        }
    }
})
module.exports = router