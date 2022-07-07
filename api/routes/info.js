const router = require('@koa/router')({
    prefix: '/api/user/info'
})
const fetch = require('node-fetch')
const connPromise = require('../utils/connectDB')
const __config__ = require('../utils/readConfig')
const {
    Op
} = require('sequelize')
//获取学校列表信息
router.post('/school', async (ctx, next) => {
    try {
        //获取可信的uid
        const _post_param = ctx.request.body
        const response = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${ __config__.wx.appid }&secret=${ __config__.wx.secret }&js_code=${ _post_param.code }&grant_type=authorization_code`)
        const _data = await response.json();
        if (!_data.openid) throw new Error(JSON.stringify(_data))
        //获取包含用户已注册的学校列表
        const conn = await connPromise;
        const res = await conn.models.school.findAll({
            attributes: [
                ['sid', 'id'], 'name',
            ],
            include: {
                model: conn.models.campus,
                as: 'Sc',
                required: true,
                attributes: [
                    ['cid', 'id'], 'name'
                ],
                include: {
                    model: conn.models.user,
                    as: 'Cu',
                    attributes: ['name'],
                    where: {
                        uid: {
                            [Op.startsWith]: _data.openid
                        }
                    },
                    required: false
                }
            }
        })
        /**完成操作 */
        ctx.body = res
    } catch (error) {
        console.log("/api/user/info/school error ###", error.message);
        ctx.body = {
            errorCode: 1,
            message: error.message
        }
    }
})
//提交界面获取指定校区可选列表信息
.get('/submit-list', async (ctx, next) => {
    try {
        //获取可信的uid
        const {
            uid
        } = JSON.parse(ctx.state.user.subject)
        const schoolSid = parseInt(uid.slice(-6))
        const conn = await connPromise;
        const res = await conn.models.campus.findAll({
            attributes: [
                ['name', 'branch'],
                'tip',
                'location',
                ['cid', 'id']
            ],
            where: {
                schoolSid
            },
            include: [{
                model: conn.models.place,
                as: 'Cp',
                required: true,
                attributes: ['name', ['pid', 'id']]
            }]
        })
        /**完成操作 */
        ctx.body = res
    } catch (error) {
        console.log("/api/user/info/submit-list error ###", error.message);
        ctx.body = {
            errorCode: 1,
            message: error.message
        }
    }
})
//首页获取列表信息
.post('/index/tip', async (ctx, next) => {
    try {
        const {
            uid
        } = JSON.parse(ctx.state.user.subject)
        const sid = parseInt(uid.slice(-6))
        //提取可能出现的属性
        const { key } = ctx.request.body
        const conn = await connPromise
        const attr = [
            'cid',
            ['name', 'branch']
        ]
        if(!key){
            attr.push('tip', 'notice')
        }else{
            const search = (await conn.models.search.findOrCreate({
                where: {
                    name: key
                },
                defaults: {
                    schoolSid: sid
                }
            }))[0]
            await search.increment('count')
        }
        const res = await conn.models.campus.findAll({
            attributes: attr,
            where: {
                schoolSid: sid
            },
        })
        ctx.state.campus = {
            model:res
        }
        await next()
        //完成操作
        ctx.body = {
            res,
            list: ctx.body
        }
    } catch (error) {
        console.log("/api/user/info/index-list error ### ", error.message);
        ctx.body = {
            errorCode: 1,
            message: error.message
        }
    }
})
//首页获取更多列表信息
.post('/index/:more', async (ctx, next) => {
    try {
        const conn = await connPromise
        let [model,condition] = [null,{
            claim: {
                [Op.is]: null
            }
        }]
        if(ctx.params.more === 'tip'){
            model = ctx.state.campus?.model
        }else if(ctx.params.more === 'list'){
            const { cid,min } = ctx.request.body
            const { uid } = JSON.parse(ctx.state.user.subject)
            const sid = parseInt(uid.slice(-6))
            //过滤cid和min
            if(
                !/^\d+$/.test(cid)
                || !/^\d+$/.test(min)
            )throw new Error('参数错误')
            //查询模型
            model = [await conn.models.campus.findOne({
                where: {
                    cid,
                    schoolSid: sid
                }
            })]
            //条件
            condition.oid = {
                [Op.lt]: BigInt(min)
            }
        }else{
            throw new Error('请求地址错误')
        }
        //如果key存在,增加物品条件
        const { key } = ctx.request.body
        if(key){
            condition = {
                ...condition,
                [Op.or]: [{
                    name: {
                        [Op.substring]: key
                    }
                }, {
                    address: {
                        [Op.substring]: key
                    }
                }, {
                    time: {
                        [Op.substring]: key
                    }
                }, {
                    describe: {
                        [Op.substring]: key
                    }
                }]
            }
        }
        //查询物品
        const res = await Promise.all(model.map(c=>c.getCp({
            order: [
                [{
                    model: conn.models.object,
                    as: 'Po'
                }, 'oid', 'DESC']
            ],
            limit: 10,
            subQuery: false,
            attributes: [
                ['name', 'lay'],
                ['location', 'loc'],
                'pid'
            ],
            include: [{
                model: conn.models.object, 
                as: 'Po',
                attributes: [
                    ['oid', 'id'], 'name', ['address', 'find'], 'time', 'describe', 'image'
                ],
                where: condition
            }]
        })))
        //完成操作
        ctx.body = res
    } catch (error) {
        console.log("/api/user/info/index-list error ### ", error.message);
        ctx.body = {
            errorCode: 1,
            message: error.message
        }
    }
})
//用户页面获取相关信息数量
.get('/user-count', async (ctx, next) => {
    try {
        const { uid } = JSON.parse(ctx.state.user.subject)
        //查询未被领取的数量
        const conn = await connPromise
        const release = conn.models.object.findAll({
            attributes: [
                [conn.fn('count', conn.col('oid')),'count']
            ],
            where: {
                userUid: uid,
            },
            order: ['claim'],
            group: 'claim'
        })
        //查询浏览足迹
        const footmark = conn.models.object.count({
            where: {
                claim: {
                    [Op.is]: null
                }
            },
            include: [{
                model: conn.models.user,
                as: 'Footmark_o',
                required: true,
                where: {
                    uid
                }
            }]
        })
        //完成操作
        ctx.body = {
            release: await release,
            footmark: await footmark
        }
    } catch (error) {
        console.log("/api/user/info/user-count error ### ", error.message);
        ctx.body = {
            errorCode: 1,
            message: error.message
        }
    }
})
//用户页面获取物品相关信息
.post('/user-object', async (ctx, next) => {
    try {
        const { uid } = JSON.parse(ctx.state.user.subject)
        const sid = parseInt(uid.slice(-6))
        const { page } = ctx.request.body
        //查询未被领取的数量
        const conn = await connPromise
        let condition,res = null
        switch (page) {
            case 0:
                if(!condition)
                    condition = {
                        where: {
                            userUid: uid,
                            claim: {
                                [Op.is]: null
                            }
                        }  
                    }
            case 1:
                if(!condition)
                    condition = {
                        where: {
                            userUid: uid,
                            claim: {
                                [Op.not]: null
                            }
                        }  
                    }
            case 2:
                if(!condition)
                    condition = {
                        where: {
                            claim: {
                                [Op.is]: null
                            }
                        },
                        include: [{
                            model: conn.models.user,
                            as: 'Footmark_o',
                            attributes: ['name'],
                            required: true,
                            where: {
                                uid
                            }
                        }] 
                    }
                res = await conn.models.campus.findAll({
                    attributes: [
                        'cid',
                        ['name', 'branch']
                    ],
                    include: [{
                        model: conn.models.place,
                        as: 'Cp',
                        required: true,
                        attributes: [['name', 'lay'],
                        ['location', 'loc'],
                        'pid'],
                        include: [{
                            model: conn.models.object,
                            as: 'Po',
                            required: true,
                            attributes: [
                                ['oid', 'id'], 'name', ['address', 'find'], 'time', 'describe', 'image'
                            ],
                            ...condition
                        }]
                    }]
            })
                break;
            default:
                throw new Error('参数超过范围')
                break;
        }
        //完成操作
        ctx.body = {
            list: res
        }
    } catch (error) {
        console.log("/api/user/info/user-object error ### ", error.message);
        ctx.body = {
            errorCode: 1,
            message: error.message
        }
    }
})
//物品详情页获取相关信息
.post('/details-info', async (ctx, next) => {
    try {
        const { id:oid,getInfo:flag } = ctx.request.body
        if(
            !/^\d+$/.test(oid)
            || typeof flag !== 'boolean'
        )throw new Error('参数错误')
        //查询
        const conn = await connPromise
        const obj = await conn.models.object.findByPk(oid)
        //判断需求
        const objInfo = flag
        ? (({ oid:id,name,address:find,time,describe,image })=>({id,name,find,time,describe,image}))(obj.get({ plain: true }))
        : (({ oid:id })=>({id}))(obj.get({ plain: true }))
        const location = flag
        ? { location: await obj.getPlace({
            attributes: [['name', 'lay'],['location', 'loc']]
        }) }
        : {}
         //获取信息
        ctx.body = {
            user: await obj.getUser({
                attributes: ['name','image','coin']
            }),
            info: {
                ...objInfo,
                ...location
            }
        }
    } catch (error) {
        console.log("/api/user/info/details-info error ### ", error.message);
        ctx.body = {
            errorCode: 1,
            message: error.message
        }
    }
})
//搜索页获取标签信息
.get('/search-tip', async (ctx, next) => {
    try {
        const { uid } = JSON.parse(ctx.state.user.subject)
        const sid = parseInt(uid.slice(-6))
        const conn = await connPromise
        const tip = await conn.models.search.findAll({
            where: {
                schoolSid: sid
            },
            attributes: ['name','count'],
            limit: 10,
            order: [['count','DESC']]
        })
         //获取信息
        ctx.body = {
            tip
        }
    } catch (error) {
        console.log("/api/user/info/search-tip error ### ", error.message);
        ctx.body = {
            errorCode: 1,
            message: error.message
        }
    }
})

module.exports = router