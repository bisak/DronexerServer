const fileType = require('file-type');
const util = require('../util')()
const fsUtil = util.fsUtil

module.exports = function (data) {
  const pictureData = data.pictureData;
  const userData = data.userData;

  return {
    uploadPicture(req, res){
      let file = req.file;
      let fileData = req.body;

      let realFileType = fileType(file.buffer)
      file.realFileType = realFileType

      if (realFileType.mime !== 'image/jpeg' && realFileType.mime !== 'image/jpg' && realFileType.mime !== 'image/png') {
        return res.json({
          success: false,
          msg: 'Unaccepted file type.'
        })
      }

      pictureData.savePicture(file, fileData)
        .then((data) => {
          res.json({
            success: true,
            msg: 'Uploaded successfully.',
            data: data
          })
        })
        .catch((err) => {
          console.log(err)
          return res.status(500).json({
            success: false,
            msg: 'Server error.',
            error: err.toString()
          })
        })
    },
    getPictureById(req, res){
      const pictureId = req.params.pictureId
      const size = req.params.size

      if (size != 'big' && size != 'small') {
        return res.json({
          success: false,
          msg: 'Invalid size parameter.'
        })
      }

      pictureData.getPictureById(pictureId).then((data) => {
        if (data) {
          let fileDir = fsUtil.joinDirectory(data.directory, `${size}_${data.fileName}`)
          return res.sendFile(fileDir, { root: './' })
        }
        return res.status(404).json({
          success: false,
          msg: "Picture not found."
        })
      }).catch((error) => {
        return res.status(500).json({
          success: false,
          msg: "Error finding picture by id.",
          err: error.message
        })
      })

    },
    getPicturesByUsername(req, res){
      const username = req.params.username
      let limits = req.query

      if (limits && limits.hasOwnProperty('from') && limits.hasOwnProperty('to')) {
        limits.to = Number(limits.to)
        limits.from = Number(limits.from)
        limits.size = limits.to - limits.from

        if (isNaN(limits.to) || isNaN(limits.from)) {
          return res.status(400).json({
            success: false,
            msg: `From and to queries should be numbers.`
          })
        }
        if (limits.size > 50) {
          return res.status(400).json({
            success: false,
            msg: `Query too big. You can request up to 50 items at a time. Requested: ${limits.size}`
          })
        }
        if (limits.size <= 0) {
          return res.status(400).json({
            success: false,
            msg: `Who tf would request ${limits.size} items?`
          })
        }
      } else {
        limits.from = 0
        limits.to = 25
        limits.size = limits.to - limits.from
      }

      pictureData.getPicturesByUsername(username, limits).then((data) => {
        if (data.length) {
          return res.json({
              success: true,
              msg: `Successfully retrieved ${data.length} items`,
              data: data
            }
          )
        }
        return userData.getUserByUsername(username).then((user) => {
          if (!user) {
            return res.status(404).json({
              success: false,
              msg: 'User not found.'
            })
          }
        })

      }).catch((err) => {
        return res.status(500).json({
          success: false,
          msg: "Error getting by username.",
          error: err
        })
      })
    }
  }
}