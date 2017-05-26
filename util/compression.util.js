const fsUtil = require('./fs.util')
const sharp = require('sharp')
const QUALITY = 50
const PROFILE_PIC_SIZE = 250

module.exports = {
  makePictureAndThumbnail (picture, pictureName) {
    const fileLocation = fsUtil.getFileLocation(new Date())
    const dirToExist = fsUtil.joinDirectory('..', fsUtil.storagePath, ...fileLocation)
    return fsUtil.ensureDirectoryExists(dirToExist).then(() => {
      const thumbnailFileName = fsUtil.joinDirectory('..', fsUtil.storagePath, ...fileLocation, `small_${pictureName}`)
      const pictureFileName = fsUtil.joinDirectory('..', fsUtil.storagePath, ...fileLocation, `big_${pictureName}`)
      let big = sharp(picture.buffer)
        .resize(1920)
         .overlayWith(fsUtil.joinDirectory('..', fsUtil.logosPath, 'text-logo.png'), {
           gravity: sharp.gravity.southeast
         })
        .jpeg({ quality: QUALITY })
        .toFile(pictureFileName)
      let small = sharp(picture.buffer).resize(480).jpeg({ quality: QUALITY }).toFile(thumbnailFileName)
      return Promise.all([big, small])
    })
  },
  compressProfilePicture (profilePicture, userId) {
    const profilePicName = fsUtil.joinDirectory('..', fsUtil.profilePicPath, `${userId}.jpg`)
    return sharp(profilePicture.buffer).resize(PROFILE_PIC_SIZE, PROFILE_PIC_SIZE).jpeg({quality: 50}).toFile(profilePicName)
  }
}
