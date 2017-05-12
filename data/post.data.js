const util = require('../util')()
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil
const metadataUtil = util.metadataUtil
const helperUtil = util.helperUtil
const mongooseConfig = require('../config/database/mongoose.config');

module.exports = (models) => {
  const Post = models.postModel
  return {
    savePicture (fileData) {
      return compressionUtil.makePictureAndThumbnail(fileData.file).then((compressedPictures) => {
        const fileLocation = fsUtil.getFileLocation(new Date)
        const fileName = fsUtil.generateFileName('jpg')
        const storagePath = fsUtil.storagePath
        const thumbnailFileName = fsUtil.joinDirectory(storagePath, ...fileLocation, `small_${fileName}`)
        const pictureFileName = fsUtil.joinDirectory(storagePath, ...fileLocation, `big_${fileName}`)

        let writeBig = fsUtil.writeFileToDisk(pictureFileName, compressedPictures[0])
        let writeSmall = fsUtil.writeFileToDisk(thumbnailFileName, compressedPictures[1])

        return Promise.all([writeBig, writeSmall]).then(() => {
          const metadata = metadataUtil.extractMetadata(fileData.file)
          const isGenuine = metadataUtil.isGenuineDronePicture(metadata)
          if (fileData.data.tags) fileData.data.tags = helperUtil.filterTags(fileData.data.tags)

          let picToSave = {
            userId: fileData.user._id,
            fileName: fileName,
            tags: fileData.data.tags,
            caption: fileData.data.caption,
            droneTaken: fileData.data.droneTaken,
            isGenuine: isGenuine,
            metadata: metadata
          }

          return Post.create(picToSave)
        })
      })
    },
    deletePost(postId, userId){
      return Post.findOneAndRemove({_id: postId, userId: userId}).then((deletedPost) => {
        const fileLocation = fsUtil.getFileLocation(deletedPost.createdAt)
        let bigFileDir = fsUtil.joinDirectory(fsUtil.storagePath, ...fileLocation, `big_${deletedPost.fileName}`)
        let smallFileDir = fsUtil.joinDirectory(fsUtil.storagePath, ...fileLocation, `small_${deletedPost.fileName}`)
        let deleteFileBig = fsUtil.deleteFile(bigFileDir)
        let deleteFileSmall = fsUtil.deleteFile(smallFileDir)
        return Promise.all([deleteFileBig, deleteFileSmall])
      })
    },
    editPost(postId, userId, updateData){
      let dataToSave = {
        caption: updateData.newCaption || '',
        tags: helperUtil.filterTags(updateData.newTags) || [],
        droneTaken: updateData.newSelectedDroneName || ''
      }
      return Post.findOneAndUpdate({_id: postId, userId: userId}, {$set: dataToSave})
    },
    saveComment (postId, comment) {
      return Post.findByIdAndUpdate(postId, {$push: {comments: comment}})
    },
    saveLike (postId, userId) {
      return Post.findByIdAndUpdate(postId, {$addToSet: {likes: userId}})
    },
    removeLike (postId, userId) {
      return Post.findByIdAndUpdate(postId, {$pull: {likes: userId}})
    },
    getPictureById (postId, selector) {
      return Post.findById(postId).select(selector)
    },
    getUserPostsById (uploaderId, time, selector) {
      return Post
        .find({
          userId: uploaderId,
          createdAt: {$lt: time}
        })
        .limit(mongooseConfig.postsPerRequest)
        .sort('-createdAt').select(selector)
    },
    getExplorePosts (time, selector) {
      return Post
        .find({createdAt: {$lt: time}})
        .limit(mongooseConfig.postsPerRequest)
        .sort('-createdAt').select(selector)
    },
    getPostsByTag(time, tag, selector){
      return Post
        .find({
          tags: tag,
          createdAt: {$lt: time}
        })
        .limit(mongooseConfig.postsPerRequest)
        .sort('-createdAt').select(selector)
    },
    getPostsCountById (userId) {
      return Post.where('userId', userId).count()
    },
    deleteAllUserPosts(user){
      return Post.find({userId: user._id}).then((retrievedPosts) => {
        let deletedPicturesPromises = []
        deletedPicturesPromises.push(Post.remove({userId: user._id}))
        retrievedPosts.forEach((post) => {
          let fileLocation = fsUtil.getFileLocation(post.createdAt)
          let bigFileDir = fsUtil.joinDirectory(fsUtil.storagePath, ...fileLocation, `big_${post.fileName}`)
          let smallFileDir = fsUtil.joinDirectory(fsUtil.storagePath, ...fileLocation, `small_${post.fileName}`)
          deletedPicturesPromises.push(fsUtil.deleteFile(bigFileDir))
          deletedPicturesPromises.push(fsUtil.deleteFile(smallFileDir))
        })
        return Promise.all(deletedPicturesPromises)
      })
    }
  }
}
