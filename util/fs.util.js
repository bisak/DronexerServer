const fs = require('fs-extra')
const path = require('path')
const shortid = require('shortid')
const appConfig = require('../config/app/app.config')

module.exports = {
  getFileLocationString(inDate) {
    let date = inDate
    const day = date.getUTCDate()
    const month = date.getUTCMonth() + 1
    const year = date.getUTCFullYear()
    return `${year}/${month}/${day}`
  },
  generateRandomId() {
    return shortid.generate()
  },
  ensureDirectoryExists(path) {
    return fs.ensureDir(path)
  },
  writeFileToDisk(fileName, data) {
    return fs.outputFile(fileName, data)
  },
  deleteFile(fileName) {
    return fs.remove(fileName)
  },
  joinDirectory: path.join,
  storagePath: appConfig.storagePath,
  profilePicPath: appConfig.profilePicPath,
  logosPath: appConfig.logosPath
}
