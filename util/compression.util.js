const fsUtil = require('./fs.util')
const sharp = require('sharp')
const QUALITY = 50
const PROFILE_PIC_SIZE = 250

module.exports = {
  makePictureAndThumbnail (picture, fileLocation, fileName) {
    const sDirToEnsure = fsUtil.joinDirectory('..', fsUtil.storagePath, ...fileLocation, 's')
    const lDirToEnsure = fsUtil.joinDirectory('..', fsUtil.storagePath, ...fileLocation, 'l')

    let ensureDirsExist = [fsUtil.ensureDirectoryExists(sDirToEnsure), fsUtil.ensureDirectoryExists(lDirToEnsure)]

    return Promise.all(ensureDirsExist).then(() => {
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
    const profilePicName = fsUtil.joinDirectory('..', fsUtil.profilePicPath, `${userId}.jpg`)
    return sharp(profilePicture.buffer)
      .resize(PROFILE_PIC_SIZE, PROFILE_PIC_SIZE)
      .jpeg({ quality: QUALITY })
      .toFile(profilePicName)
  }
}
