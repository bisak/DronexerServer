const util = require('../util')
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil
const metadataUtil = util.metadataUtil
const helperUtil = util.helperUtil
const mongooseConfig = require('../config/database/mongoose.config')

module.exports = (models) => {
  const Post = models.postModel
  const Follow = models.followModel
  const Comment = models.commentModel
  const User = models.userModel

  return {
    async savePicture(fileData, user) {
      const fileName = `${fsUtil.generateRandomId()}.jpg`
      const fileLocation = fsUtil.getFileLocationString(new Date())
      await compressionUtil.makePictureAndThumbnail(fileData.file, fileLocation, fileName)
      const metadata = metadataUtil.extractMetadata(fileData.file, fileData.realFileType)
      const isGenuine = metadataUtil.isGenuineDronePicture(metadata)
      fileData.tags = helperUtil.filterTags(fileData.tags)
      if (fileData.droneTaken) {
        fileData.droneTaken = helperUtil.assignDroneNames(fileData.droneTaken)
      }

      await Post.create({
        user: user._id,
        fileLocation: fileLocation,
        fileName: fileName,
        tags: fileData.tags,
        caption: fileData.caption,
        droneTaken: fileData.droneTaken,
        isGenuine: isGenuine,
        metadata: metadata
      })
      return User.findOneAndUpdate({ _id: user._id }, { $inc: { postsCount: 1 } })
    },
    async deletePost(postId, userId) {
      let deletedPost = await Post.findOneAndRemove({ _id: postId, user: userId })
      if (deletedPost) {
        let bigFileDir = fsUtil.joinDirectory('..', fsUtil.storagePath, deletedPost.fileLocation, 'l', deletedPost.fileName)
        let smallFileDir = fsUtil.joinDirectory('..', fsUtil.storagePath, deletedPost.fileLocation, 's', deletedPost.fileName)
        let deleteFileBig = fsUtil.deleteFile(bigFileDir)
        let deleteFileSmall = fsUtil.deleteFile(smallFileDir)
        await Promise.all([deleteFileBig, deleteFileSmall])
        return User.findOneAndUpdate({ _id: userId }, { $inc: { postsCount: -1 } })
      } else {
        return Promise.resolve()
      }
    },
    editPost(postId, userId, updateData) {
      let dataToSave = {
        caption: updateData.newCaption,
        tags: helperUtil.filterTags(updateData.newTags),
        droneTaken: helperUtil.assignDroneNames(updateData.newDroneTaken)
      }
      return Post.findOneAndUpdate({ _id: postId, user: userId }, { $set: dataToSave }, { new: true })
    },
    async saveComment(data) {
      let createdComment = await Comment.create(data)
      return Post.findOneAndUpdate({ _id: data.postId }, {
        $push: { comments: createdComment._id },
        $inc: { commentsCount: 1 }
      })
    },
    async saveLike(postId, userId) {
      /* UpdateOne is a nasty workaround of a bug that findOneAndUpdate doesn't return correct nModified when used with $addToSet */
      let result = await Post.findById(postId).updateOne({ $addToSet: { likes: userId } })
      if (result.nModified) {
        return Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } })
      }
    },
    async removeLike(postId, userId) {
      /* UpdateOne is a nasty workaround of a bug that findOneAndUpdate doesn't return correct nModified */
      let result = await Post.findById(postId).updateOne({ $pull: { likes: userId } })
      if (result.nModified) {
        return Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } })
      }
    },
    getPostById(postId, selector) {
      return Post.findById(postId).select(selector).populate('user', 'username _id')
    },
    getUserPostsById(uploaderId, time, selector) {
      return Post
        .find({
          user: uploaderId,
          createdAt: { $lt: time }
        })
        .limit(mongooseConfig.postsPerRequest)
        .sort('-createdAt')
        .select(selector)
        .populate('user', 'username _id')
    },
    getExplorePosts(time, selector) {
      return Post
        .find({ createdAt: { $lt: time } })
        .limit(mongooseConfig.postsPerRequest)
        .sort('-createdAt')
        .select(selector)
        .populate('user', 'username _id')
    },
    getPostsByTag(tag, time, selector) {
      return Post
        .find({
          tags: tag,
          createdAt: { $lt: time }
        })
        .limit(mongooseConfig.postsPerRequest)
        .sort('-createdAt')
        .select(selector)
        .populate('user', 'username _id')
    },
    async deleteAllUserPosts(user) {
      let retrievedPosts = await Post.find({ user: user._id })
      let deletedPicturesPromises = []
      await Post.remove({ user: user._id })
      retrievedPosts.forEach((post) => {
        const fileLocation = fsUtil.getFileLocationString(post.createdAt)
        const bigFileDir = fsUtil.joinDirectory('..', fsUtil.storagePath, fileLocation, 'l', post.fileName)
        const smallFileDir = fsUtil.joinDirectory('..', fsUtil.storagePath, fileLocation, 's', post.fileName)
        deletedPicturesPromises.push(fsUtil.deleteFile(bigFileDir), fsUtil.deleteFile(smallFileDir))
      })
      Promise.all(deletedPicturesPromises)
    },
    async getFeedPosts(userId, time) {
      // Get the ids of all users that are followed by the user who makes the request
      let followedByUser = await Follow.find({ followerId: userId }).distinct('followeeId').lean()
      return Post.find({ user: followedByUser, createdAt: { $lt: time } })
        .limit(mongooseConfig.postsPerRequest)
        .sort('-createdAt')
        .populate('user', 'username _id')
    },
    async getCommentsByPostId(postId) {
      return Comment.find({ postId: postId }).populate('user', '_id username')
    }
  }
}
