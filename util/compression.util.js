const sharp = require('sharp')

module.exports = function () {
	return {
		compressPicture(newPicture){
			let buffer = newPicture.buffer
			const image = sharp(buffer);
			return image.metadata()
				.then(function (metadata) {
					return image
						.resize(Math.round(metadata.width / 2))
						.toBuffer();
				})

		}
	}
}