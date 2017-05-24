const Jimp = require('jimp')
const fsUtil = require('./fs.util')
const QUALITY = 50
const PROFILE_PIC_SIZE = 200

module.exports = {
  makePictureAndThumbnail (picture, pictureName) {
    const fileLocation = fsUtil.getFileLocation(new Date())
    const thumbnailFileName = fsUtil.joinDirectory('..', fsUtil.storagePath, ...fileLocation, `small_${pictureName}`)
    const pictureFileName = fsUtil.joinDirectory('..', fsUtil.storagePath, ...fileLocation, `big_${pictureName}`)
    /* Maybe works + optimize */
    return Jimp.read(picture.buffer).then((image) => {
      image.resize(1920, Jimp.AUTO).quality(QUALITY).write(pictureFileName)
      image.resize(480, Jimp.AUTO).quality(QUALITY).write(thumbnailFileName)
    })
  },
  compressProfilePicture (profilePicture, userId) {
    const profilePicName = fsUtil.joinDirectory('..', fsUtil.profilePicPath, `${userId}.jpg`)
    return Jimp.read(profilePicture.buffer).then((image) => {
      image.resize(PROFILE_PIC_SIZE, PROFILE_PIC_SIZE).quality(QUALITY).write(profilePicName)
    })
  }
}
