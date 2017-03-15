let formidable = require('formidable')
const fsUtil = require('../util')().fsUtil
const uuidGen = require('uuid/v1');

module.exports = function (data) {
	const userData = data.pictureData;
	return {
		uploadPicture(req, res){
			const day = new Date().getDate()
			const month = new Date().getMonth() + 1
			const year = new Date().getFullYear()
			const uuid = uuidGen()

			const dirPath = fsUtil.generatePath('storage', 'pictures', `${year}`, `${month}`, `${day}`)
			const fileName = fsUtil.generatePath(dirPath, uuid + ".jpg")

			fsUtil.ensureDirectory(dirPath)

			let form = new formidable.IncomingForm();
			form.parse(req);


			form.on('fileBegin', function (name, file) {
				file.path = fileName;
			});


			form.on('file', function (name, file) {
				console.log('Uploaded ' + file.name);
				console.log(file)
				res.json({
					success:true,
					msg: "Uploaded",
					file
				})
			});

			form.on('progress', function (bytesReceived, bytesExpected) {
				process.stdout.write(Math.round((bytesReceived / bytesExpected) * 100) + '')
			});


			userData.savePicture()
		}
	}
}