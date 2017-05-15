const sharp = require('sharp')
const fsUtil = require('./fs.util')()
const bigPicQuality = 45
const smallPicQuality = 50
const profilePicSize = 200

module.exports = function () {
  return {
    makePictureAndThumbnail(newPicture){
      let bigImage = sharp(newPicture.buffer);
      let smallImage = sharp(newPicture.buffer);

      return bigImage.metadata().then((metadata) => {
        /*TODO improve resize and logo logic*/
        let imgBig = bigImage.overlayWith(fsUtil.joinDirectory('..', fsUtil.logosPath, 'icon.png'), {
          gravity: sharp.gravity.southeast
        }).resize(1920).withoutEnlargement().jpeg({quality: bigPicQuality}).toBuffer()

        let imgSmall = smallImage.resize(480).withoutEnlargement().jpeg({quality: smallPicQuality}).toBuffer()

        return Promise.all([imgBig, imgSmall])
      })
    },
    compressProfilePicture(newProfilePicture){
      return sharp(newProfilePicture.buffer).resize(profilePicSize, profilePicSize).jpeg().toBuffer()
    }
  }
}
