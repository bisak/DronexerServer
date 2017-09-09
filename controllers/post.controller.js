const util = require('../util')
const helperUtil = util.helperUtil

module.exports = (data) => {
  const postData = data.postData
  const userData = data.userData
  return {
    async getPostById(req, res) {
      const { postId } = req.params
      const { user } = req
      let retrievedPost = await postData.getPostById(postId)
      if (retrievedPost) {
        let post = retrievedPost.toObject()
        post.isLikedByCurrentUser = helperUtil.isLikedBy(post, user)
        return res.json({
          success: true,
          data: post
        })
      }
    },
    async getUserPosts(req, res) {
      const { username } = req.params
      const { before } = req.query
      const { user } = req
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf())) {
        return res.status(400).json({
          success: false,
          msg: 'Bad time parameter.'
        })
      }

      let requestedUser = await userData.getUserByUsername(username, '_id')
      if (!requestedUser) {
        return res.status(404).json({
          success: false,
          msg: 'No such user.'
        })
      }
      let retrievedData = await postData.getUserPostsById(requestedUser._id, parsedTime)
      if (retrievedData.length) {
        let posts = retrievedData.map(post => post.toObject())
        posts = helperUtil.areLikedBy(posts, user)
        return res.json({
          success: true,
          data: posts
        })
      }
      return res.status(404).json({
        success: false,
        msg: 'No posts available.'
      })
    },
    async getExplorePosts(req, res) {
      const { before } = req.query
      const { user } = req
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf())) {
        return res.status(400).json({
          success: false,
          msg: 'Bad parameter.'
        })
      }
      let retrievedData = await postData.getExplorePosts(parsedTime)
      if (retrievedData.length) {
        let posts = retrievedData.map(post => post.toObject())
        posts = helperUtil.areLikedBy(posts, user)
        return res.json({
          success: true,
          msg: `Successfully retrieved ${posts.length} items.`,
          data: posts
        })
      }
      return res.status(404).json({
        success: false,
        msg: `No posts available.`
      })
    },
    async getFeedPosts(req, res) {
      const { user } = req
      const { before } = req.query
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf())) {
        return res.status(400).json({
          success: false,
          msg: 'Bad parameter.'
        })
      }
      let retrievedData = await postData.getFeedPosts(user._id, parsedTime)
      if (retrievedData.length) {
        let posts = retrievedData.map(post => post.toObject())
        posts = helperUtil.areLikedBy(posts, user)
        return res.json({
          success: true,
          msg: `Successfully retrieved ${posts.length} items.`,
          data: posts
        })
      }
      return res.status(404).json({
        success: false,
        msg: `No posts available.`
      })
    },
    async getTagPosts(req, res) {
      const { before } = req.query
      const urlTag = req.params.tag
      const { user } = req
      let parsedTime = new Date(Number(before))
      if (isNaN(parsedTime.valueOf()) || urlTag.length === 0 || urlTag.length > 20) {
        return res.status(400).json({
          success: false,
          msg: 'Bad parameter.'
        })
      }
      let retrievedData = await postData.getPostsByTag(urlTag, parsedTime)
      if (retrievedData.length) {
        let posts = retrievedData.map(post => post.toObject())
        posts = helperUtil.areLikedBy(posts, user)
        console.log(posts)
        return res.json({
          success: true,
          msg: `Successfully retrieved ${posts.length} items.`,
          data: posts
        })
      }
      return res.status(404).json({
        success: false,
        msg: `No posts available.`
      })
    },
    async getPostCommentsByPostId(req, res) {
      const postId = req.params.postId
      let retrievedComments = await postData.getCommentsByPostId(postId)
      if (retrievedComments.length) {
        return res.json({
          success: true,
          data: retrievedComments
        })
      }
      return res.status(404).json({
        success: false,
        msg: 'Comments not found.'
      })
    },
    async commentPostById(req, res) {
      const comment = req.body.comment
      const postId = req.params.postId
      const user = req.user
      const objToSave = {
        user: user._id,
        comment: comment,
        postId: postId
      }
      let data = await postData.saveComment(objToSave)
      if (data) {
        return res.json({
          success: true,
          msg: 'Commented successfully.'
        })
      }
    },
    async likePostById(req, res) {
      const { postId } = req.params
      const userId = req.user._id
      await postData.saveLike(postId, userId)
      return res.json({
        success: true,
        msg: 'Liked successfully.'
      })
    },
    async unLikePostById(req, res) {
      const { postId } = req.params
      const userId = req.user._id
      await postData.removeLike(postId, userId)
      return res.json({
        success: true,
        msg: 'Uniked successfully.'
      })
    },
    async deletePostById(req, res) {
      const { postId } = req.params
      const userId = req.user._id
      await postData.deletePost(postId, userId)
      return res.json({
        success: true,
        msg: `Deleted successfully.`
      })
    },
    async editPostById(req, res) {
      const postId = req.params.postId
      const userId = req.user._id
      let newData = req.body

      let editedPost = await postData.editPost(postId, userId, newData)
      return res.json({
        success: true,
        msg: 'Edited successfully.',
        data: editedPost
      })
    }
  }
}
