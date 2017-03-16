const fileType = require('file-type');

module.exports = function (data) {
	const userData = data.pictureData;
	return {
		uploadPicture(req, res){
			let file = req.file;
			let realFileType = fileType(file.buffer)

			if (realFileType.mime !== 'image/jpeg' && realFileType.mime !== 'image/jpg' && realFileType.mime !== 'image/png') {
				return res.json({
					success: false,
					msg: 'Unaccepted file type.'
				})
			}

			file.realFileType = realFileType

			userData.savePicture(file).then((data)=>{
				console.log(data)
			})
		}
	}
}