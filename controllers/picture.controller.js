const fileType = require('file-type')
const util = require('../util')
const fsUtil = util.fsUtil

module.exports = function (data) {
  const postData = data.postData

  return {
    getSinglePicture (req, res) {
      // http://localhost:8080/api/pictures/2017/5/26/l/Hyb_-kLWZ
      const { year, month, day, size, fileName } = req.params

      if (size !== 's' && size !== 'l') {
        return res.json({
          success: false,
          msg: 'Invalid size parameter.'
        })
      }
      const fileToSend = fsUtil.joinDirectory(fsUtil.storagePath, year, month, day, size, `${fileName}.jpg`)
      return res.sendFile(fileToSend, { root: '../' }, (error) => {
        if (error) {
          return res.status(error.statusCode)
            .json({ success: false, msg: 'Error finding picture.' })
        }
      })
    },
    uploadPicture (req, res) {
      let file = req.file
      let requestBody = JSON.parse(req.body.data)
      let fileData = {
        user: req.user,
        caption: requestBody.caption,
        tags: requestBody.tags,
        droneTaken: requestBody.droneTaken,
        file: file,
        realFileType: fileType(file.buffer)
      }

      if (fileData.realFileType.mime !== 'image/jpeg' && fileData.realFileType.mime !== 'image/jpg' && fileData.realFileType.mime !== 'image/png') {
        return res.json({
          success: false,
          msg: 'Unaccepted file type.'
        })
      }

      return postData.savePicture(fileData).then((data) => {
        let dataToReturn = data.toObject()
        return res.json({
          success: true,
          msg: 'Uploaded successfully.',
          data: dataToReturn
        })
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Server error.'
        })
      })
    }
  }
}
