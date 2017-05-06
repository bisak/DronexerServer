const util = require('../util')()
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil
const metadataUtil = util.metadataUtil
const helperUtil = util.helperUtil

module.exports = (models) => {
  const Post = models.postModel
  return {
    savePicture (newPicture, fileData) {
      const fileLocation = fsUtil.getFileLocation(new Date)
      const fileName = fsUtil.generateFileName('jpg')
      const storagePath = fsUtil.storagePath

      const thumbnailFileName = fsUtil.joinDirectory(storagePath, ...fileLocation, `small_${fileName}`)
      const pictureFileName = fsUtil.joinDirectory(storagePath, ...fileLocation, `big_${fileName}`)

      return compressionUtil.makePictureAndThumbnail(newPicture).then((compressedPicture) => {
        let writeBig = fsUtil.writeFileToDisk(pictureFileName, compressedPicture[0])
        let writeSmall = fsUtil.writeFileToDisk(thumbnailFileName, compressedPicture[1])

        return Promise.all([writeBig, writeSmall]).then(() => {
          const metadata = metadataUtil.extractMetadata(newPicture)
          const isGenuine = metadataUtil.isGenuineDronePicture(metadata)
          let tags = []
          if (fileData.tags) tags = helperUtil.filterTags(fileData.tags)

          let picToSave = {
            userId: fileData.user._id,
            fileName: fileName,
            tags: tags,
            caption: fileData.caption,
            droneTaken: fileData.droneTaken,
            isGenuine: isGenuine,
            metadata: metadata
          }

          return Post.create(picToSave)
        })
      })
    },
    deletePost(postId){
      return Post.findOneAndRemove({_id: postId}).then((deletedPost) => {
        const fileLocation = fsUtil.getFileLocation(deletedPost.createdAt)
        let bigFileDir = fsUtil.joinDirectory(fsUtil.storagePath, ...fileLocation, `big_${deletedPost.fileName}`)
        let smallFileDir = fsUtil.joinDirectory(fsUtil.storagePath, ...fileLocation, `small_${deletedPost.fileName}`)
        let deleteFileBig = fsUtil.deleteFile(bigFileDir)
        let deleteFileSmall = fsUtil.deleteFile(smallFileDir)
        return Promise.all([deleteFileBig, deleteFileSmall])
      })
    },
    editPost(postId, updateData){
      let dataToSave = {
        caption: updateData.newCaption || '',
        tags: helperUtil.filterTags(updateData.newTags) || [],
        droneTaken: updateData.newSelectedDroneName || ''
      }
      return Post.findByIdAndUpdate(postId, {$set: dataToSave})
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
      return Post.find({
        userId: uploaderId,
        createdAt: {$lt: time}
      }).limit(3).sort('-createdAt').select(selector)
    },
    getExplorePosts (time, selector) {
      return Post.find({createdAt: {$lt: time}}).limit(3).sort('-createdAt').select(selector)
    },
    getPicturesCountById (userId) {
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
