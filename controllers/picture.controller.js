const fileType = require('file-type')
const util = require('../util')
const fsUtil = util.fsUtil
const validatorUtil = util.validatorUtil

module.exports = (data) => {
  const postData = data.postData
  const userData = data.userData

  return {
    getSinglePicture(req, res) {
      const { year, month, day, size, fileName } = req.params

      if (size !== 's' && size !== 'l') {
        return res.json({
          success: false,
          msg: 'Invalid size parameter.'
        })
      }
      const fileToSend = fsUtil.joinDirectory(fsUtil.storagePath, year, month, day, size, fileName)
      return res.sendFile(fileToSend, { root: '../' }, (error) => {
        if (error) {
          res.end()
          console.log(error)
          console.log('An error occured in getSinglePicture()... :/')
        }
      })
    },
    async uploadPicture(req, res) {
      let file = req.file
      let requestBody = {}
      if (!req.file) {
        return res.status(400).json({
          success: false,
          msg: 'No picture provided.'
        })
      }
      if (req.body && req.body.data) {
        requestBody = JSON.parse(req.body.data)
      }
      let user = req.user

      let fileData = {
        caption: requestBody.caption, // TODO add .trim() to every input...
        tags: requestBody.tags,
        droneTaken: requestBody.droneTaken,
        file: file
      }

      try {
        fileData.realFileType = fileType(file.buffer) || {}
      } catch (error) {
        console.log(error)
        return res.status(400).json({
          success: false,
          msg: 'Bad picture :/'
        })
      }

      const incomingPictureValidator = validatorUtil.validateIncomingPictureType(fileData.realFileType)
      if (incomingPictureValidator.isValid === false) {
        return res.status(400).json({
          success: false,
          msg: incomingPictureValidator.msg
        })
      }

      await postData.savePicture(fileData, user)
      return res.json({
        success: true,
        msg: 'Uploaded successfully.'
      })

    }
  }
}
