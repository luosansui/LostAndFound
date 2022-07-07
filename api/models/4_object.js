
const connPromise = require('../utils/connectDB')
const {
    DataTypes
} = require('sequelize')

;(async ()=>{
    try {
        const conn = await connPromise
        if(!conn) throw new Error("object model mount failed")
        conn.define('object', {
        // 在这里定义模型属性
            oid: {
                type: DataTypes.BIGINT.UNSIGNED.ZEROFILL,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.CHAR(32),
                allowNull: false
            },
            address: {
                type: DataTypes.JSON,
                allowNull: false
            },
            time: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            describe: {
                type: DataTypes.STRING(1024)
            },
            image: {
                type: DataTypes.JSON
            },

        })
          console.log("object model mounted"); 
    } catch (error) {
        console.log(error.message);
    }
})()