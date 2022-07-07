const router = require('@koa/router')()
const koaBody = require('koa-body')
const path = require('path')
const tool = require('../utils/tool')
const connPromise = require('../utils/connectDB')
//上传文件
router.post('/api/serve/img/upload', koaBody({
    multipart: true, // 支持文件上传
    formidable: {
        uploadDir: path.join(__dirname, '../public/image'),
        keepExtensions: true,
        maxFileSize: 20 * 1024 * 1024, //最大20MB
        hash: 'md5',
        onFileBegin: async (n, file) => {
            // 获取文件后缀
            const filename = tool.getUploadFileName(file.path);
            const date = tool.getUploadDirName()
            // 最终要保存到的文件夹目录
            const dir = path.join(__dirname, `../public/image/${date}`);
            // 检查文件夹是否存在如果不存在则新建文件夹
            tool.checkDirExist(dir);
            // 重新覆盖 file.path 属性
            file.path = `${dir}/upload_${filename}`
            // 设置文件src
            file.src = `/image/${date}/upload_${filename}`
        }
    }
}), async (ctx, next) => {
    try {
        if(!ctx.request.files)throw new Error('无文件上传')
        const conn = await connPromise
        const createList = []
        const files = (await Promise.all(tool.objectToArray(ctx.request.files).map(async f => {
            //非法类型文件直接删除
            if (!/image\/\S+/.test(f.type)) {
                tool.deleteFile(f.src)
                return false
            }
            //合法文件检查hash值
            const rtn = {
                src: f.src,
                hash: f.hash,
                type: f.type
            }
            const res = await conn.models.image.findByPk(f.hash)
            //若存在相同文件则删除新文件并修改其src
            if (res) {
                tool.deleteFile(f.src)
                rtn.src = res.src
            }else{
                createList.push(rtn)
            }
            return rtn
        }))).filter(e => e)
        //检查上传合法文件列表
        if (files.length === 0) throw new Error('非法文件')
        //保存hash与路径到数据库
        console.log(files);
        conn.models.image.bulkCreate(createList)
        //返回结果
        ctx.body = {
            errorCode: 0,
            message: "ok",
            url: files
        }
    } catch (error) {
        console.log("image upload error ### ", error.message);
        ctx.body = {
            errorCode: 1,
            message: error.message
        }
    }
})
module.exports = router