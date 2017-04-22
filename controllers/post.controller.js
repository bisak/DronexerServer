const fileType = require('file-type')
const util = require('../util')()
const fsUtil = util.fsUtil
const validatorUtil = util.validatorUtil

module.exports = function (data) {
  const postData = data.postData
  const userData = data.userData
  return {
    uploadPicture (req, res) {
      let file = req.file
      let fileData = req.body

      let realFileType = fileType(file.buffer)
      file.realFileType = realFileType

      if (realFileType.mime !== 'image/jpeg' && realFileType.mime !== 'image/jpg' && realFileType.mime !== 'image/png') {
        return res.json({
          success: false,
          msg: 'Unaccepted file type.'
        })
      }

      postData.savePicture(file, fileData).then((data) => {
        let dataToReturn = data.toObject()
        res.json({
          success: true,
          msg: 'Uploaded successfully.',
          data: dataToReturn
        })
      }).catch((error) => {
        console.log(error)
        return res.status(500).json({
          success: false,
          msg: 'Server error.',
          err: error
        })
      })
    },
    getPictureById (req, res) {
      const pictureId = req.params.pictureId
      const size = req.params.size

      if (size !== 'big' && size !== 'small') {
        return res.json({
          success: false,
          msg: 'Invalid size parameter.'
        })
      }

      postData.getPictureById(pictureId).then((data) => {
        if (data) {
          let fileDir = fsUtil.joinDirectory(fsUtil.getStoragePath(), data.directory, `${size}_${data.fileName}`)
          return res.sendFile(fileDir, {
            root: './'
          })
        }
        return res.status(404).json({
          success: false,
          msg: 'Picture not found.'
        })
      }).catch((error) => {
        return res.status(500).json({
          success: false,
          msg: 'Error finding picture by id.',
          err: error.message
        })
      })
    },
    getPostCommentsById(req, res){
      const pictureId = req.params.pictureId
      postData.getPictureById(pictureId, 'comments').then((retrievedComments) => {
        if (retrievedComments) {
          let retrievedData = retrievedComments.toObject()
          /*Match comments to usernames*/
          let comments = retrievedData.comments
          const commenterIds = comments.map((comment) => comment.userId)
          return userData.getUsernamesById(commenterIds).then((retrievedUsers) => {
            comments.forEach((comment) => {
              retrievedUsers.forEach((user) => {
                if (comment.userId === user._id) {
                  comment.username = user.username
                }
              })
            })
            return res.json({
              success: true,
              data: comments
            })
          })
        }
        return res.status(404).json({
          success: false,
          msg: 'Comments not found.'
        })
      }).catch((error) => {
        console.log(error)
        return res.status(500).json({
          success: false,
          msg: 'Error getting picture comments by id.',
          err: error
        })
      })
    },
    getPostsByUsername (req, res) {
      const urlUsername = req.params.username
      const currentUser = req.user
      let before = req.query['before']
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf())) {
        res.status(400).json({
          success: false,
          msg: "Bad parameter."
        })
      }

      postData.getPostsByUsername(urlUsername, before).then((retrievedData) => {
        if (retrievedData.length) {
          let dataToReturn = retrievedData.map(part => part.toObject())
          dataToReturn.forEach((post) => {
            if (currentUser)
              post.isLikedByCurrentUser = post.likes.some(likeId => likeId === currentUser._id)
            /* TODO Do this with separate count queries. */
            post.commentsCount = post.comments.length
            post.likesCount = post.likes.length
            delete post.comments
            delete post.likes
          })
          return res.json({
            success: true,
            msg: `Successfully retrieved ${dataToReturn.length} items.`,
            data: dataToReturn
          })
        }
        return res.status(404).json({
          success: false,
          msg: `This user has no pictures.`
        })
      }).catch((error) => {
        console.log(error)
        return res.status(500).json({
          success: false,
          msg: 'Error getting pictures by username.',
          err: error
        })
      })
    },
    getExplorePosts (req, res) {
      let before = req.query['before']
      const currentUser = req.user
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf())) {
        res.status(400).json({
          success: false,
          msg: "Bad parameter."
        })
      }
      postData.getExplorePosts(parsedTime).then(retrievedData => {
        if (retrievedData.length) {
          let dataToReturn = retrievedData.map(element => element.toObject())
          dataToReturn.forEach((post) => {
            if (currentUser)
              post.isLikedByCurrentUser = post.likes.some(likeId => likeId === currentUser._id)
            /* TODO Do this with separate count queries to save ram. */
            post.commentsCount = post.comments.length
            post.likesCount = post.likes.length
            delete post.comments
            delete post.likes
          })
          return res.json({
            success: true,
            msg: `Successfully retrieved ${dataToReturn.length} items.`,
            data: dataToReturn
          })
        }
        return res.status(404).json({
          success: false,
          msg: `No pictures.`
        })
      }).catch((error) => {
        console.log(error)
        return res.status(500).json({
          success: false,
          msg: 'Error getting pictures by username.',
          err: error
        })
      })
    },
    commentPostById (req, res) {
      const comment = req.body.comment
      const pictureId = req.params.pictureId
      const user = req.user

      const objToSave = {
        userId: user._id,
        comment: comment
      }
      postData.saveComment(pictureId, objToSave).then((data) => {
        if (data) {
          return res.json({
            success: true,
            msg: 'Commented successfully.'
          })
        }
      }).catch((error) => {
        console.log(error)
        return res.status(500).json({
          success: false,
          msg: 'Error commenting picture.',
          err: error
        })
      })
    },
    likePostById (req, res) {
      const id = req.params.pictureId
      const user = req.user
      const userId = user._id

      postData.saveLike(id, userId).then(success => {
        res.json({
          success: true,
          msg: 'Liked successfully.'
        })
      }).catch(error => {
        console.log(error)
        res.status(500).json({
          success: false,
          msg: 'Error liking picture.',
          err: error
        })
      })
    },
    unLikePostById (req, res) {
      const id = req.params.pictureId
      const user = req.user
      const userId = user._id

      postData.removeLike(id, userId).then(success => {
        res.json({
          success: true,
          msg: 'Uniked successfully.'
        })
      }).catch(error => {
        console.log(error)
        res.status(500).json({
          success: false,
          msg: 'Error unliking picture.',
          err: error
        })
      })
    }
  }
}
