const util = require('../util')()
const fsUtil = util.fsUtil
const compressionUtil = util.compressionUtil
const metadataUtil = util.metadataUtil

module.exports = (models) => {
	const Picture = models.pictureModel
	return {
		savePicture(newPicture, fileData){
			const fileTree = fsUtil.generateFileTreePath('storage', 'pictures')
			const thumbnailName = fsUtil.generateFileName(fileTree, newPicture.realFileType.ext, 'small_')
			const pictureName = fsUtil.generateFileName(fileTree, newPicture.realFileType.ext, 'big_')
			const path = fsUtil.generateFileName(fileTree, newPicture.realFileType.ext)

			let metadata = metadataUtil.extractMetadata(newPicture)

			return compressionUtil.makePictureAndThumbnail(newPicture).then((data) => {

				let writeBigPromise = fsUtil.writeFileToDisk(pictureName, data[0])
				let writeSmallPromise = fsUtil.writeFileToDisk(thumbnailName, data[1])

				return Promise.all([writeBigPromise, writeSmallPromise]).then(() => {
					let picToSave = {
						filename: newPicture.originalname,
						uploaderUsername: fileData.username,
						path: path,
						tags: fileData.tags,
						description: fileData.description,
						droneTaken: fileData.droneTaken,
						metadata: metadata
					}
					return Picture.create(picToSave)
				})
			})
		}
	}
}
