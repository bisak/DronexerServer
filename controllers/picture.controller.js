const fileType = require('file-type');
const util = require('../util')()
const fsUtil = util.fsUtil

module.exports = function (data) {
	const pictureData = data.pictureData;
	return {
		uploadPicture(req, res){
			let file = req.file;
			let fileData = req.body;

			let realFileType = fileType(file.buffer)
			file.realFileType = realFileType

			if (realFileType.mime !== 'image/jpeg' && realFileType.mime !== 'image/jpg' && realFileType.mime !== 'image/png') {
				return res.json({
					success: false,
					msg: 'Unaccepted file type.'
				})
			}

			pictureData.savePicture(file, fileData)
				.then((data) => {
					res.json({
						success: true,
						msg: 'Uploaded successfully.',
						data
					})
				})
				.catch((err) => {
					return res.status(500).json({
						success: false,
						msg: 'Server error.',
						err
					})
				})
		},
		getPictureById(req, res){
			const pictureId = req.params.pictureId
			const size = req.params.size

			if (size === 'big' || size === 'small') {

				pictureData.getPictureById(pictureId).then((data) => {
					if (data) {
						let fileDir = fsUtil.joinDirectory(data.directory, `${size}_${data.fileName}`)
						return res.sendFile(fileDir, { root: "./" })
					}
					return res.status(404).json({ success: false, msg: "Picture not found." })
				}).catch((err) => {
					console.log(err)
				})

			} else {
				res.json({
					success: false,
					msg: 'Invalid size parameter.'
				})
			}
		},
	}
}