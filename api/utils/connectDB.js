//创建数据库连接
const {
    Sequelize
} = require('sequelize')
const __config__ = require('./readConfig')
console.log("开始连接数据库...")
module.exports = new Promise(async (resolve)=>{
    try {
        const sequelize = new Sequelize(__config__.db)
        await sequelize.authenticate()
        console.log("数据库连接成功")
        resolve(sequelize)
    } catch (err) {
        console.log("数据库连接失败 ###",err.message)
        resolve()
    }
})



