const fs = require('fs-extra')
const path = require('path')
const uuidGen = require('uuid/v1');
const appConfig = require('../config/app/app.config')

module.exports = function () {
  return {
    generateFileTreePath(){
      let arr = Array.from(arguments)
      const day = new Date().getDate()
      const month = new Date().getMonth() + 1
      const year = new Date().getFullYear()
      let timeBasedDir = [year, month, day].map(String)
      arr.push(...timeBasedDir)
      return path.join(...arr)
    },
    generateFileName(ext){
      return `${uuidGen()}.${ext}`
    },
    ensureDirectoryExists(path){
      return new Promise((resolve, reject) => {
        fs.ensureDir(path, (err, data) => {
          if (err) reject(err)
          resolve()
        })
      })
    },
    writeFileToDisk(fileName, data){
      return new Promise((resolve, reject) => {
        fs.outputFile(fileName, data, (err) => {
          if (err) {
            console.log('writePicture error: ' + err)
            reject('writePicture error: ' + err)
          }
          resolve()
        })
      })
    },
    joinDirectory(){
      return path.join(...arguments)
    },
    getStoragePath(){
      return appConfig.storagePath
    }
  }
}