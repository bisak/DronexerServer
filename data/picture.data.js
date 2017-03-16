const util = require('../util')()
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil
const metadataUtil = util.metadataUtil
const exifParser = require('exif-parser')

module.exports = (models) => {
	const Picture = models.pictureModel
	return {
		savePicture(newPicture){
			const dirPath = fsUtil.generateFileStorePath('storage', 'pictures')
			const fname = fsUtil.generatePicturePath(dirPath, newPicture.realFileType.ext)

			let metadata = exifParser.create(newPicture.buffer).parse()

			let metadataToWrite = metadataUtil.filterMetadataObject(metadata)

			console.log(metadataToWrite)

			return compressionUtil.compressPicture(newPicture).then((data) => {
				return fsUtil.writePicture(fname, data).then(() => {
					let picToSave ={
						filename: newPicture.originalname,
						uploaderUsername: "biskazzfornow",
						tags: ["pesho", "gosho"],
						path: fname,
						description: "-No Description",
						droneTaken: "unspecified",
						metadata: metadataToWrite
					}
					return Picture.create(picToSave)
				})
			})
		}
	}
}
