const fsUtil = require('./fs.util')
const sharp = require('sharp')
const QUALITY = 50
const PROFILE_PIC_SIZE = 250

module.exports = {
  makePictureAndThumbnail (picture, fileLocation, fileName) {
    let dirsToExist = [
      fsUtil.ensureDirectoryExists(fsUtil.joinDirectory('..', fsUtil.storagePath, ...fileLocation, 's')),
      fsUtil.ensureDirectoryExists(fsUtil.joinDirectory('..', fsUtil.storagePath, ...fileLocation, 'l'))
    ]

    return Promise.all(dirsToExist).then(() => {
      const thumbnailFileName = fsUtil.joinDirectory('..', fsUtil.storagePath, ...fileLocation, 's', `${fileName}.jpg`)
      const pictureFileName = fsUtil.joinDirectory('..', fsUtil.storagePath, ...fileLocation, 'l', `${fileName}.jpg`)

      let big = sharp(picture.buffer)
        .resize(1920)
        .overlayWith(fsUtil.joinDirectory('..', fsUtil.logosPath, 'text-logo.png'), { gravity: sharp.gravity.southeast })
        .jpeg({ quality: QUALITY })
        .toFile(pictureFileName)

      let small = sharp(picture.buffer)
        .resize(480)
        .jpeg({ quality: QUALITY })
        .toFile(thumbnailFileName)

      return Promise.all([big, small])
    })
  },
  compressProfilePicture (profilePicture, userId) {
    const dirToExist = fsUtil.joinDirectory('..', fsUtil.profilePicPath)
    return fsUtil.ensureDirectoryExists(dirToExist).then(() => {
      const profilePicName = fsUtil.joinDirectory('..', fsUtil.profilePicPath, `${userId}.jpg`)
      return sharp(profilePicture.buffer)
        .resize(PROFILE_PIC_SIZE, PROFILE_PIC_SIZE)
        .jpeg({ quality: QUALITY })
        .toFile(profilePicName)
    })
  }
}
