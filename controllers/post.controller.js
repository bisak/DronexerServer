const fileType = require('file-type')
const util = require('../util')()
const fsUtil = util.fsUtil
const validatorUtil = util.validatorUtil
const helperUtil = util.helperUtil
const dateUtil = util.dateUtil
let postData = {}
let userData = {}

function handleRetrievedPosts(posts, authenticatedUser, req, res) {
  if (posts.length) {
    const postUploaderIds = posts.map((post) => post.userId)
    posts.forEach((post) => {
      if (authenticatedUser)
        post.isLikedByCurrentUser = post.likes.some(likeId => likeId === authenticatedUser._id)
      /* TODO Do this with separate count queries. */
      post.timeAgo = dateUtil.moment(post.createdAt).fromNow()
      post.commentsCount = post.comments.length
      post.likesCount = post.likes.length
      delete post.comments
      delete post.likes
    })
    return userData.getUsernamesByIds(postUploaderIds).then((retrievedUsers) => {
      posts = helperUtil.assignUsernames(posts, retrievedUsers)
      return res.json({
        success: true,
        msg: `Successfully retrieved ${posts.length} items.`,
        data: posts
      })
    })
  }
  return res.status(204).json({
    success: false,
    msg: `This user has no pictures.`
  })
}

module.exports = function (data) {
  postData = data.postData
  userData = data.userData
  return {
    uploadPicture (req, res) {
      let file = req.file
      let fileData = req.body
      fileData.user = req.user
      if (fileData.tags) fileData.tags = JSON.parse(fileData.tags)

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
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Server error.',
          err: error
        })
      })
    },
    getPictureById (req, res) {
      const postId = req.params.postId
      const size = req.params.size

      if (size !== 'big' && size !== 'small') {
        return res.json({
          success: false,
          msg: 'Invalid size parameter.'
        })
      }

      postData.getPictureById(postId).then((data) => {
        const fileLocation = fsUtil.getFileLocation(data.createdAt)
        if (data) { /*TODO => optimize*/
          let fileDir = fsUtil.joinDirectory(fsUtil.storagePath, ...fileLocation, `${size}_${data.fileName}`)
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
    getUserPosts (req, res) {
      const urlUsername = req.params.username
      const authenticatedUser = req.user
      let before = req.query['before']
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf())) {
        return res.status(400).json({
          success: false,
          msg: "Bad time parameter."
        })
      }

      return userData.getUserIdsByUsernames(urlUsername).then((retrievedIds) => {
        if (retrievedIds.length) {
          const userId = retrievedIds[0]._id
          return postData.getUserPostsById(userId, parsedTime).then((retrievedData) => {
            let posts = retrievedData.map(post => post.toObject())
            return handleRetrievedPosts(posts, authenticatedUser, req, res)
          })
        } else {
          return res.status(500).json({
            success: false,
            msg: 'No such user.'
          })
        }
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error getting pictures by username.'
        })
      })

    },
    getExplorePosts (req, res) {
      let before = req.query['before']
      const authenticatedUser = req.user
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf())) {
        res.status(400).json({
          success: false,
          msg: "Bad parameter."
        })
      }
      postData.getExplorePosts(parsedTime).then((retrievedData) => {
        let posts = retrievedData.map(post => post.toObject())
        return handleRetrievedPosts(posts, authenticatedUser, req, res)
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error getting pictures by username.',
          err: error
        })
      })
    },
    getPostCommentsBypostId(req, res){
      const postId = req.params.postId
      postData.getPictureById(postId, 'comments').then((retrievedComments) => {
        if (retrievedComments) {
          let retrievedData = retrievedComments.toObject()
          /*Match comments to usernames*/
          let comments = retrievedData.comments
          const commenterIds = comments.map((comment) => comment.userId)
          return userData.getUsernamesByIds(commenterIds).then((retrievedUsers) => {
            comments = helperUtil.assignUsernames(comments, retrievedUsers)
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
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error getting picture comments by id.',
          err: error
        })
      })
    },
    commentPostById (req, res) {
      const comment = req.body.comment
      const postId = req.params.postId
      const user = req.user

      const objToSave = {
        userId: user._id,
        comment: comment
      }
      postData.saveComment(postId, objToSave).then((data) => {
        if (data) {
          return res.json({
            success: true,
            msg: 'Commented successfully.'
          })
        }
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error commenting picture.',
          err: error
        })
      })
    },
    likePostById (req, res) {
      const postId = req.params.postId
      const user = req.user
      const userId = user._id

      postData.saveLike(postId, userId).then(success => {
        return res.json({
          success: true,
          msg: 'Liked successfully.'
        })
      }).catch(error => {
        console.error(error)
        res.status(500).json({
          success: false,
          msg: 'Error liking picture.',
          err: error
        })
      })
    },
    unLikePostById (req, res) {
      const postId = req.params.postId
      const user = req.user
      const userId = user._id

      postData.removeLike(postId, userId).then(success => {
        res.json({
          success: true,
          msg: 'Uniked successfully.'
        })
      }).catch(error => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error unliking picture.',
          err: error
        })
      })
    },
    deletePostById(req, res){
      const postId = req.params.postId
      const user = req.user
      /*TODO check if post is own*/
      postData.deletePost(postId).then(deletedPost => {
        return res.json({
          success: true,
          msg: `Deleted successfully.`
        })
      }).catch(error => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error deleting post.',
          err: error
        })
      })
    },
    editPostById(req, res){
      const postId = req.params.postId
      let newData = req.body

      postData.editPost(postId, newData).then(editedData => {
        return res.json({
          success: true,
          msg: 'Edited successfully.'
        })
      }).catch(error => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error editing post.',
          err: error
        })
      })
    }
  }
}