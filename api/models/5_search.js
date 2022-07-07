
const connPromise = require('../utils/connectDB')
const {
    DataTypes
} = require('sequelize')

;(async ()=>{
    try {
        const conn = await connPromise
        if(!conn) throw new Error("search model mount failed")
        conn.define('search', {
        // 在这里定义模型属性
            tid: {
                type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.CHAR(32),
                allowNull: false
            },
            count: {
                type:  DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            }
        })
          console.log("search model mounted"); 
    } catch (error) {
        console.log(error.message);
    }
})()