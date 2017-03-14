const router = require('express').Router()

module.exports = (controllers, middlewares) => {
	const defaultController = controllers.defaultController
	router
		.get('*', defaultController.sendIndex)
		.all('*', defaultController.invalidEndpoint)

	return router
}
