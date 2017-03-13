const router = require('express').Router()
const controllers = require('../controllers')

module.exports = (app, data) => {
	const defaultController = controllers.defaultController(data)
	router
		.get('*', defaultController.sendIndex)
		.all('*', defaultController.invalidEndpoint)

	app.use(router)
}
