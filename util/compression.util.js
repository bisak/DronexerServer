const sharp = require('sharp')

module.exports = function () {
	return {
		makePictureAndThumbnail(newPicture){
			const image = sharp(newPicture.buffer);
			return image.metadata()
				.then((metadata) => {
					let imgBig = image.resize(Math.round(metadata.width / 2)).toBuffer()
					let imgSmall = image.resize(Math.round(metadata.width / 5)).toBuffer() /*Fix resize logic*/
					return Promise.all([imgBig, imgSmall])
				})

		}
	}
}