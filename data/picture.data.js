const util = require('../util')()
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil
const metadataUtil = util.metadataUtil

module.exports = (models) => {
  const Picture = models.pictureModel
  return {
    savePicture(newPicture, fileData){
      const fileDirectory = fsUtil.generateFileTreePath('storage', 'pictures')
      const fileName = fsUtil.generateFileName('jpg')

      const thumbnailFileName = fsUtil.joinDirectory(fileDirectory, `small_${fileName}`)
      const pictureFileName = fsUtil.joinDirectory(fileDirectory, `big_${fileName}`)

      return compressionUtil.makePictureAndThumbnail(newPicture).then((data) => {
        let writeBig = fsUtil.writeFileToDisk(pictureFileName, data[0])
        let writeSmall = fsUtil.writeFileToDisk(thumbnailFileName, data[1])

        return Promise.all([writeBig, writeSmall]).then(() => {

          const metadata = metadataUtil.extractMetadata(newPicture)
          const isGenuine = metadataUtil.isGenuineDronePicture(metadata)

          let picToSave = {
            uploaderUsername: fileData.uploaderUsername,
            directory: fileDirectory,
            fileName: fileName,
            tags: fileData.tags,
            caption: fileData.caption,
            droneTaken: fileData.droneTaken,
            isGenuine: isGenuine,
            metadata: metadata
          }

          return Picture.create(picToSave)

        })
      })
    },
    getPictureById(pictureId){
      return Picture.findById(pictureId)
    },
    getPicturesByUsername(username, limits){
      return Picture.find().where('uploaderUsername').equals(username).skip(limits.from).limit(limits.size)
    },
    getPicturesCountByUsername(username){
      return Picture.where('uploaderUsername', username).count()
    }
  }
}
