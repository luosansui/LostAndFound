const connPromise = require('../utils/connectDB')
const {
    DataTypes
} = require('sequelize')

;
(async () => {
    try {
        const conn = await connPromise
        if (!conn) throw new Error("place model mount failed")
        conn.define('place', {
            // 在这里定义模型属性
            pid: {
                type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.CHAR(16),
                allowNull: false
            },
            location: {
                type: DataTypes.JSON,
                allowNull: false
            }
        })
        console.log("place model mounted");
    } catch (error) {
        console.log(error.message);
    }
})()