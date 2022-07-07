console.log('读取配置文件')
const fs = require('fs')
const path = require('path')
module.exports = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json'), {
    encoding: 'utf-8'
}))