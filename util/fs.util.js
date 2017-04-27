const fs = require('fs-extra')
const path = require('path')
const shortid = require('shortid')
const appConfig = require('../config/app/app.config')

module.exports = function () {
  return {
    getFileLocation(inDate){
      let date
      if (!inDate) {
        date = new Date(inDate)
      } else {
        date = inDate
      }
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      return [year, month, day].map(String)
    },
    generateFileName(ext){
      return `${shortid.generate()}.${ext}`
    },
    ensureDirectoryExists(path){
      return new Promise((resolve, reject) => {
        fs.ensureDir(path, (error, data) => {
          if (error) return reject(error)
          return resolve()
        })
      })
    },
    writeFileToDisk(fileName, data){
      return new Promise((resolve, reject) => {
        fs.outputFile(fileName, data, (error) => {
          if (error) return reject(error)
          return resolve()
        })
      })
    },
    deleteFile(fileName){
      return new Promise((resolve, reject) => {
        fs.remove(fileName, error => {
          if (error) return reject(error)
          return resolve()
        })
      })
    },
    joinDirectory: path.join,
    storagePath: appConfig.storagePath
  }
}