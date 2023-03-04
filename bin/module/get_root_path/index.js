const path = require('path');
let _path=''

class RootPath
{
    constructor (curDir,targetDir) {
        this.curDir = curDir;
        this.targetDir = targetDir
        this._rootPath = null
    }

    get() {
        this._getTargetPath(this.curDir);
        return path.dirname(this._rootPath)
    }

    _getTargetPath(str){
        if(path.basename(str) !== this.targetDir ){
            this._getTargetPath(path.dirname(str));
        }else{
            this._rootPath = str;
        }
    }
}

module.exports= RootPath