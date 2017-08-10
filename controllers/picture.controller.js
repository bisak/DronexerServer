const fileType = require('file-type')
const util = require('../util')
const fsUtil = util.fsUtil
const validatorUtil = util.validatorUtil

module.exports = function (data) {
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
          return res.status(error.statusCode).json({ success: false, msg: 'Error finding picture.' })
        }
      })
    },
    async uploadPicture(req, res) {
      let file = req.file
      let requestBody = JSON.parse(req.body.data)
      let user = req.user

      let fileData = {
        caption: requestBody.caption,
        tags: requestBody.tags,
        droneTaken: requestBody.droneTaken,
        file: file,
        realFileType: fileType(file.buffer)
      }

      const incomingPictureValidator = validatorUtil.validateIncomingPictureType(fileData.realFileType)
      if (incomingPictureValidator.isValid === false) {
        return res.json({
          success: false,
          msg: incomingPictureValidator.msg
        })
      }

      try {
        let data = await postData.savePicture(fileData, user)
        return res.json({
          success: true,
          msg: 'Uploaded successfully.',
          data: data
        })
      } catch (error) {
        console.error('Uploading error', error)
        return res.status(500).json({
          success: false,
          msg: 'Server error.'
        })
      }

    }
  }
}
