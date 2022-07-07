const connPromise = require('../utils/connectDB')
const {
    DataTypes
} = require('sequelize')

;
(async () => {
    try {
        const conn = await connPromise
        if (!conn) throw new Error("campus model mount failed")
        conn.define('campus', {
            // 在这里定义模型属性
            cid: {
                type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.CHAR(32),
                allowNull: false
            },
            location: {
                type: DataTypes.JSON,
                allowNull: false
            },
            tip: {
                type: DataTypes.JSON,
                allowNull: false
            },
            notice: {
                type: DataTypes.STRING,
            }
        })
        console.log("campus model mounted");
    } catch (error) {
        console.log(error.message);
    }
})()