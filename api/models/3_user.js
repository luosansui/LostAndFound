
const connPromise = require('../utils/connectDB')
const {
    DataTypes
} = require('sequelize')

;(async ()=>{
    try {
        const conn = await connPromise
        if(!conn) throw new Error("user model mount failed")
        conn.define('user', {
        // 在这里定义模型属性
            uid: {
                type: DataTypes.CHAR(64),
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.CHAR(16),
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            coin: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                allowNull: false,
                defaultValue: 0
            }
        })
          console.log("user model mounted"); 
    } catch (error) {
        console.log(error.message);
    }
})()