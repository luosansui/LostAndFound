//导包
const Koa = require('koa');
const path = require('path')
const fs = require('fs')
const koaBody = require('koa-body')
const jwt = require('koa-jwt')
const static = require('koa-static')

//挂载模型
const model = require('./utils/mountModel')
//导入路由模块
const info = require('./routes/info')
const session = require('./routes/session')
const operate = require('./routes/operate')
const serve = require('./routes/serve')
//读取配置
const __config__ = require('./utils/readConfig')
//实例化对象
const app = new Koa()
//解析post请求内容
app.use(koaBody())
//开放public
.use(static(path.join(__dirname, './public')))
//JWT鉴权
.use(jwt({ secret: __config__.jwt.user.secret }).unless({ 
    path: [
        /^\/api\/user\/session\/login$/,
        /^\/api\/user\/info\/school$/
    ]
}))
//加载路由
.use(info.routes())
.use(session.routes())
.use(operate.routes())
.use(serve.routes())
//监听端口
.listen(3000)