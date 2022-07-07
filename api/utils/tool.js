const path = require('path');
const fs = require('fs');
module.exports = {
    getUploadDirName: ()=>{
        const date = new Date();
        let month = Number.parseInt(date.getMonth()) + 1;
        month = month.toString().length > 1 ? month : `0${month}`;
        const dir = `${date.getFullYear()}${month}${date.getDate()}`;
        return dir;
    },
    checkDirExist(path) {
        fs.existsSync(path) || fs.mkdirSync(path)
    },
    getUploadFileName(name) {
        const ext = name.split('upload_')
        return ext[ext.length - 1]
    },
    objectToArray(obj){
        const values = Object.values(obj)
        const res = []
        values.forEach(e => {
            if(Array.isArray(e)){
                res.push(...e)
            }else{
                res.push(e)
            }
        })
        return res
    },
    deleteFile(file){
        fs.unlinkSync(path.join(__dirname,`../public${file}`))
    }
}