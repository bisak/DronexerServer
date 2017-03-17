const fileType = require('file-type');

module.exports = function (data) {
	const userData = data.pictureData;
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


			userData.savePicture(file, fileData).then((data) => {
				console.log(data)
			}).catch((err) => {
				console.log(err)
			})
		}
	}
}