const sharp = require('sharp')
/*TODO improve resize logic*/

module.exports = function () {
  return {
    makePictureAndThumbnail(newPicture){
      let bigImage = sharp(newPicture.buffer);
      let smallImage = sharp(newPicture.buffer);

      return bigImage.metadata().then((metadata) => {

        let imgBig = bigImage.overlayWith('logos/icon.png', {
          gravity: sharp.gravity.southeast
        }).resize(2560).withoutEnlargement().jpeg({ quality: 75 }).toBuffer()

        let imgSmall = smallImage.resize(640).withoutEnlargement().jpeg({ quality: 75 }).toBuffer()

        return Promise.all([imgBig, imgSmall])
      })
    },
    compressProfilePicture(newProfilePicture){
      return sharp(newProfilePicture.buffer).resize(150, 150).jpeg().toBuffer()
    }
  }
}
