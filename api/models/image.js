const connPromise = require('../utils/connectDB')
const {
    DataTypes
} = require('sequelize')

;
(async () => {
    try {
        const conn = await connPromise
        if (!conn) throw new Error("image model mount failed")
        conn.define('image', {
            // 在这里定义模型属性
            hash: {
                type: DataTypes.CHAR(128),
                allowNull: false,
                primaryKey: true
            },
            src: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            type: {
                type: DataTypes.CHAR(64),
                allowNull: false
            }
        })
        console.log("image model mounted");
    } catch (error) {
        console.log(error.message);
    }
})()