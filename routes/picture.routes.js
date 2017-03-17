const router = require('express').Router()

module.exports = (controllers, middlewares) => {
	const pictureController = controllers.pictureController
	const pictureMiddleware = middlewares.pictureMiddleware

	router
		.post('/api/picture/upload', pictureMiddleware.uploadSingle('file'), pictureController.uploadPicture)
		.get('/api/picture/:size/:pictureId', pictureController.getPictureById)

	return router
}
