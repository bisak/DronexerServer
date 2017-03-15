const router = require('express').Router()

module.exports = (controllers, middlewares) => {
	const pictureController = controllers.pictureController

	router
		.post('/api/picture/upload',pictureController.uploadPicture)


	return router
}
