const fsUtil = require('./fs.util')
const sharp = require('sharp')
const QUALITY = 50
const PROFILE_PIC_SIZE = 250
const BIG_PICTURE_SIZE = 1920
const SMALL_PICTURE_SIZE = 480

module.exports = {
  async makePictureAndThumbnail(picture, fileLocation, fileName) {
    const smallDir = fsUtil.joinDirectory('..', fsUtil.storagePath, fileLocation, 's')
    const largeDir = fsUtil.joinDirectory('..', fsUtil.storagePath, fileLocation, 'l')
    await Promise.all([fsUtil.ensureDirectoryExists(smallDir), fsUtil.ensureDirectoryExists(largeDir)])

    const thumbnailFileName = fsUtil.joinDirectory(smallDir, `${fileName}`)
    const pictureFileName = fsUtil.joinDirectory(largeDir, `${fileName}`)

    const overlayFileName = fsUtil.joinDirectory('..', fsUtil.logosPath, 'text-logo.png')

    let big = sharp(picture.buffer)
      .resize(BIG_PICTURE_SIZE)
      .overlayWith(overlayFileName, { gravity: sharp.gravity.southeast })
      .jpeg({ quality: QUALITY })
      .toFile(pictureFileName)

    let small = sharp(picture.buffer)
      .resize(SMALL_PICTURE_SIZE)
      .jpeg({ quality: QUALITY })
      .toFile(thumbnailFileName)

    return Promise.all([big, small])
  },
  async compressProfilePicture(profilePicture, userId) {
    const dirToExist = fsUtil.joinDirectory('..', fsUtil.profilePicPath)
    await fsUtil.ensureDirectoryExists(dirToExist)
    const profilePicName = fsUtil.joinDirectory(dirToExist, `${userId}.jpg`)

    return sharp(profilePicture.buffer)
      .resize(PROFILE_PIC_SIZE, PROFILE_PIC_SIZE)
      .jpeg({ quality: QUALITY })
      .toFile(profilePicName)
  }
}
