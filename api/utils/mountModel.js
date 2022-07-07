const connPromise = require('../utils/connectDB')
const path = require('path')
//挂载模型
const fs = require('fs')
const dir = '../models'
fs.readdirSync(path.join(__dirname, dir)).forEach(e => require(`${dir}/${e}`));
(async () => {
    try {
        const conn = await connPromise
        if (!conn) throw new Error("model mount failed")
        //模型关系
        //一个学校有多个校区
        conn.models.school.hasMany(conn.models.campus, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            as: 'Sc'
        })
        conn.models.campus.belongsTo(conn.models.school)
        //一个校区有多个用户
        conn.models.campus.hasMany(conn.models.user, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            as: 'Cu'
        })
        conn.models.user.belongsTo(conn.models.campus)
        //一个用户发布多个物品
        conn.models.user.hasMany(conn.models.object, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            as: 'Uo'
        })
        conn.models.object.belongsTo(conn.models.user)
        //一个校区有多个放置地点
        conn.models.campus.hasMany(conn.models.place, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            as: 'Cp'
        })
        conn.models.place.belongsTo(conn.models.campus)
        //一个地点可以放置多个物品
        conn.models.place.hasMany(conn.models.object, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            as: 'Po'
        })
        conn.models.object.belongsTo(conn.models.place)
        //多个用户浏览多个物品,建立footmark表
        conn.models.user.belongsToMany(conn.models.object, {
            through: 'footmarks',
            as: 'Footmark_u'
        })
        conn.models.object.belongsToMany(conn.models.user, {
            through: 'footmarks',
            as: 'Footmark_o'
        })
        //一个用户可以认领多个物品,默认为空
        conn.models.user.hasMany(conn.models.object, {
            foreignKey: 'claim',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            as: 'Claim'
        })
        conn.models.object.belongsTo(conn.models.user)
        //一个学校有多条搜索记录
        conn.models.school.hasMany(conn.models.search, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            as: 'Search'
        })
        conn.models.search.belongsTo(conn.models.school)
        //同步模型
        /* conn.sync({
            alert: true
        })  */
    } catch (error) {
        console.log(error.message);
    }
})()