const router = require('express').Router()
const multer = require('multer')

const uploader = multer({
	limits: {
		fileSize: 10 * 1000000
	}
	/*Config uploader to not accept files larger than 10mb*/
})

module.exports = (controllers, middlewares) => {
	const pictureController = controllers.pictureController

	router
		.post('/api/picture/upload', uploader.single('file'), pictureController.uploadPicture)


	return router
}
