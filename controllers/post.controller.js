const util = require('../util')
const fsUtil = util.fsUtil
const helperUtil = util.helperUtil
const dateUtil = util.dateUtil
let postData = {}
let userData = {}

function handleRetrievedPosts (posts, req, res) {
  if (posts.length) {
    const authenticatedUser = req.user
    posts.forEach((post) => {
      if (authenticatedUser) {
        post.isLikedByCurrentUser = post.likes.some(likeId => likeId === authenticatedUser._id)
      }
      post.timeAgo = dateUtil.moment(post.createdAt).fromNow()
      if (post.metadata && post.metadata.dateTaken) {
        post.metadata.dateTaken = dateUtil.moment(dateUtil.moment.unix(post.metadata.dateTaken)).format('Do MMMM YYYY')
      }
      post.commentsCount = post.comments.length
      post.likesCount = post.likes.length
      delete post.comments
      delete post.likes
    })

    const postUploaderIds = posts.map((post) => post.userId)
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
    getPostById (req, res) {
      const postId = req.params.postId
      postData.getPostById(postId).then((retrievedPost) => {
        let post = retrievedPost.toObject()
        return handleRetrievedPosts([post], req, res)
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error getting post.'
        })
      })
    },
    getUserPosts (req, res) {
      const urlUsername = req.params.username
      let before = req.query['before']
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf())) {
        return res.status(400).json({
          success: false,
          msg: 'Bad time parameter.'
        })
      }

      return userData.getUserIdsByUsernames(urlUsername).then((retrievedIds) => {
        if (!retrievedIds.length) {
          return res.status(404).json({
            success: false,
            msg: 'No such user.'
          })
        }
        const userId = retrievedIds[0]._id
        return postData.getUserPostsById(userId, parsedTime).then((retrievedData) => {
          let posts = retrievedData.map(post => post.toObject())
          return handleRetrievedPosts(posts, req, res)
        })
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
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf())) {
        return res.status(400).json({
          success: false,
          msg: 'Bad parameter.'
        })
      }
      return postData.getExplorePosts(parsedTime).then((retrievedData) => {
        let posts = retrievedData.map(post => post.toObject())
        return handleRetrievedPosts(posts, req, res)
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error getting explore posts.'
        })
      })
    },
    getFeedPosts (req, res) {
      const userId = req.user._id
      let { before } = req.query
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf())) {
        return res.status(400).json({
          success: false,
          msg: 'Bad parameter.'
        })
      }
      return postData.getFeedPosts(userId, parsedTime).then((retrievedData) => {
        let posts = retrievedData.map(post => post.toObject())
        return handleRetrievedPosts(posts, req, res)
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error getting explore posts.'
        })
      })
    },
    getTagPosts (req, res) {
      let before = req.query['before']
      const urlTag = req.params.tag
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf()) || urlTag.length === 0 || urlTag.length > 20) {
        return res.status(400).json({
          success: false,
          msg: 'Bad parameter.'
        })
      }

      return postData.getPostsByTag(parsedTime, urlTag).then((retrievedData) => {
        let posts = retrievedData.map(post => post.toObject())
        return handleRetrievedPosts(posts, req, res)
      }).catch((error) => {
        console.error(error)
        return res.status(500).json({
          success: false,
          msg: 'Error getting pictures by tag.',
          err: error
        })
      })
    },
    getPostCommentsByPostId (req, res) {
      const postId = req.params.postId
      return postData.getPostById(postId, 'comments').then((retrievedComments) => {
        if (retrievedComments) {
          let retrievedData = retrievedComments.toObject()
          /* Match comments to usernames */
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
      return postData.saveComment(postId, objToSave).then((data) => {
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

      return postData.saveLike(postId, userId).then(success => {
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

      return postData.removeLike(postId, userId).then(success => {
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
    deletePostById (req, res) {
      const postId = req.params.postId
      const user = req.user
      return postData.deletePost(postId, user._id).then(deletedPost => {
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
    editPostById (req, res) {
      const postId = req.params.postId
      const user = req.user
      let newData = req.body

      return postData.editPost(postId, user._id, newData).then(editedData => {
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
