const fs = require('fs-extra')
const path = require('path')

module.exports = function () {
	return {
		generatePath(){
			let arr = Array.from(arguments)
			return path.join(...arr)
		},
		ensureDirectory(path){
			fs.ensureDirSync(path)
		}
	}
}