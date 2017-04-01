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
          let dataToReturn = data.toObject()
          res.json({
            success: true,
            msg: 'Uploaded successfully.',
            data: dataToReturn
          })
        })
        .catch((err) => {
          console.log(err)
          return res.status(500).json({
            success: false,
            msg: 'Server error.',
            error: err
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
      let queryLimits = req.query
      let limits = {}

      if (queryLimits && queryLimits.hasOwnProperty('from') && queryLimits.hasOwnProperty('to')) {
        limits.to = Number(queryLimits.to)
        limits.from = Number(queryLimits.from)
        limits.size = limits.to - limits.from

        if (isNaN(limits.to) || isNaN(limits.from) || isNaN(limits.size)) {
          return res.status(400).json({
            success: false,
            msg: `"From" and "to" queries should be numbers.`
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
            msg: `Requested ${limits.size} items?`
          })
        }
      } else {
        limits.from = 0
        limits.to = 25
        limits.size = limits.to - limits.from
      }

      pictureData.getPicturesByUsername(username, limits).then((data) => {
        if (data.length) {
          let objToReturn = data
          console.log(objToReturn)
          return res.json({
              success: true,
              msg: `Successfully retrieved ${data.length} items.`,
              data: objToReturn
            }
          )
        }
        return res.status(204).json({
          success: false,
          msg: `This user has no pictures.`
        })

      }).catch((err) => {
        console.log(err)

        return res.status(500).json({
          success: false,
          msg: "Error getting pictures by username.",
          error: err
        })
      })
    },
    commentPictureById(req, res){
      const comment = req.body.comment
      const id = req.params.pictureId
      const user = req.user
      /*TODO add validations and verifications and script escaping*/
      const objToSave = {
        username: user.username,
        comment: comment
      }
      pictureData.saveComment(id, objToSave).then((data) => {
        if (data) {
          return res.json({
            success: true,
            msg: "Commented successfully."
          })
        }
      }).catch((err) => {
        return res.status(500).json({
          success: false,
          msg: "Error commenting picture.",
          error: err
        })
      })
    },
    likePictureById(req, res){
      const id = req.params.pictureId
      const user = req.user
      const username = user.username

      pictureData.saveLike(id, username).then(success => {
        res.json({
          success: true,
          msg: "Liked successfully."
        })
      }).catch(error => {
        res.status(500).json({
          success: false,
          msg: "Error liking picture.",
          error: error
        })
      })
    },
    unLikePictureById(req, res){
      const id = req.params.pictureId
      const user = req.user
      const username = user.username

      pictureData.removeLike(id, username).then(success => {
        res.json({
          success: true,
          msg: "Uniked successfully."
        })
      }).catch(error => {
        res.status(500).json({
          success: false,
          msg: "Error unliking picture.",
          error: error
        })
      })
    }
  }
}