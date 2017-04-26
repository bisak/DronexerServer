const util = require('../util')()
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil
const metadataUtil = util.metadataUtil

module.exports = (models) => {
  const Post = models.postModel
  return {
    savePicture (newPicture, fileData) {
      const fileLocation = fsUtil.getFileLocation(new Date)
      const fileName = fsUtil.generateFileName('jpg')
      const storagePath = fsUtil.storagePath

      const thumbnailFileName = fsUtil.joinDirectory(storagePath, ...fileLocation, `small_${fileName}`)
      const pictureFileName = fsUtil.joinDirectory(storagePath, ...fileLocation, `big_${fileName}`)

      return compressionUtil.makePictureAndThumbnail(newPicture).then((data) => {
        let writeBig = fsUtil.writeFileToDisk(pictureFileName, data[0])
        let writeSmall = fsUtil.writeFileToDisk(thumbnailFileName, data[1])

        return Promise.all([writeBig, writeSmall]).then(() => {
          const metadata = metadataUtil.extractMetadata(newPicture)
          const isGenuine = metadataUtil.isGenuineDronePicture(metadata)

          let picToSave = {
            userId: fileData.user._id,
            fileName: fileName,
            tags: fileData.tags,
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

      })
    },
    saveComment (postId, comment) {
      /* addtoset or push??? */
      return Post.findByIdAndUpdate(postId, {$addToSet: {comments: comment}})
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
    getPicturesCountByUsername (userId) {
      return Post.where('userId', userId).count()
    }
  }
}
