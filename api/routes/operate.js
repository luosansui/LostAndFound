const router = require('@koa/router')()
const xss = require('xss')
const connPromise = require('../utils/connectDB')
//提交物品信息
router.post('/api/user/operate/submit-object-info', async (ctx, next) => {
    try {
        //获取可信的uid,sid
        const { uid:userUid } = JSON.parse(ctx.state.user.subject)
        const { name,address,lay:placePid,time,details,img } = ctx.request.body
        const conn = await connPromise;
        //输入过滤
        //判断name是否合法
        const campus = await conn.models.campus.findOne({
            attributes: [
                'tip'
            ],
            include: [{
                model: conn.models.user,
                as: 'Cu',
                required: true,
                attributes: ['uid'],
                where: {
                    uid:userUid
                }
            },{
                model: conn.models.place,
                as: 'Cp',
                required: true,
                attributes: ['pid'],
                where: {
                    pid:placePid
                }
            }]
        })
        if(!campus || !campus.tip.some(e=>e === name))throw new Error('非法参数')
        //转义details
        const describe = xss(details.trim())
        const image = img || []
        //转义
        //创建项目
        await conn.models.object.create({ name,address,time,describe,image,userUid,placePid })
        /**完成操作 */
        ctx.body = {
            errorCode: 0,
            message: 'ok'
        }
    } catch (error) {
        console.log("/api/user/operate/submit-object-info error ###", error.message);
        ctx.body = {
            errorCode: 1,
            message: error.message
        }
    }
})

module.exports = router