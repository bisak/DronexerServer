const fs = require('fs-extra')
const path = require('path')
const uuidGen = require('uuid/v1');

module.exports = function () {
	return {
		generateFileStorePath(){
			let arr = Array.from(arguments)
			const day = new Date().getDate()
			const month = new Date().getMonth() + 1
			const year = new Date().getFullYear()
			let timeBasedDir = [year, month, day].map(String)
			arr.push(...timeBasedDir)
			return path.join(...arr)
		},
		generatePicturePath(){
			let arr = Array.from(arguments)
			let ext = arr.pop()
			const fileName = uuidGen() + `.${ext}`
			arr.push(fileName)
			return path.join(...arr)
		},
		ensureDirectoryExists(path){
			return new Promise((resolve, reject) => {
				fs.ensureDir(path, (err, data) => {
					if (err) reject(err)
					resolve()
				})
			})
		},
		writePicture(fileName, data){
			return new Promise((resolve, reject) => {
				fs.outputFile(fileName, data, (err) => {
					if (err) reject(err)
					resolve()
				})
			})

		}
	}
}