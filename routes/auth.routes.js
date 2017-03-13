const router = require('express').Router()
const controllers = require('../controllers');
const passport = require('passport')
const authMiddleware = require('../middlewares').authMiddleware

module.exports = (app, data) => {
	const userController = controllers.userController(data)

	router
		.post('/api/register', userController.register)
		.post('/api/login', userController.login)
		.get('/api/testRoute/', authMiddleware.isInRole(), userController.testRoute)

	app.use(router);
}
