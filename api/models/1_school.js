
const connPromise = require('../utils/connectDB')
const {
    DataTypes
} = require('sequelize')

;(async ()=>{
    try {
        const conn = await connPromise
        if(!conn) throw new Error("school model mount failed")
        conn.define('school', {
        // 在这里定义模型属性
            sid: {
                type: DataTypes.INTEGER(6).UNSIGNED.ZEROFILL,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.CHAR(32),
                allowNull: false
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone: {
                type: DataTypes.CHAR(32),
                allowNull: false
            },
        })
          console.log("school model mounted"); 
    } catch (error) {
        console.log(error.message);
    }
})()