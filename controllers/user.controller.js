const passport = require('passport')
const validator = require('validator')
const encryption = require('../util')().encryptionUtility
const secrets = require('../config/secrets')
const jwt = require('jsonwebtoken')

module.exports = function (data) {
	const userData = data.userData;
	return {
		register(req, res){
			const newUser = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				age: req.body.age,
				avatar: req.body.avatar,
				email: req.body.email,
				username: req.body.username,
				password: req.body.password,
				drones: req.body.drones
			}

			if (req.body.superSecretPassword &&
				req.body.superSecretPassword == secrets.superSecretPassword) {
				newUser.roles = req.body.roles
			}

			if (!validator.isEmail(newUser.email)) {
				return res.json({
					success: false,
					msg: `Invalid email address.`,
				})
			}

			if (!validator.isLength(newUser.password, { min: 6, max: 50 })) {
				return res.json({
					success: false,
					msg: `Weak password.`,
				})
			}

			if (validator.isEmpty(newUser.username)) {
				return res.json({
					success: false,
					msg: `Empty username.`,
				})
			}

			if (newUser.firstName) newUser.firstName = validator.escape(newUser.firstName)
			if (newUser.lastName) newUser.lastName = validator.escape(newUser.lastName)
			newUser.email = validator.escape(newUser.email)
			newUser.username = validator.escape(newUser.username)

			userData.registerUser(newUser)
				.then(function (dbUser) {
					dbUser.password = undefined
					res.json(dbUser)
				})
				.catch(function (error) {
					console.log(error)
					if (error.code === 11000) {
						return res.status(409).json({
							success: false,
							msg: `This user already exists.`,
						})
					}
					return res.status(500).json({
						success: false,
						msg: `Database error: ${error.code}`,
					})
				})
		},
		login(req, res){
			const username = req.body.username
			const password = req.body.password

			userData.getUserByUsername(username)
				.then((foundUser) => {
					if (!foundUser) {
						return res.json({ success: false, msg: 'User not found' })
					}
					encryption.comparePassword(password, foundUser.password)
						.then((isMatch) => {
							if (isMatch) {
								foundUser.password = undefined
								const token = jwt.sign(foundUser, secrets.passportSecret)
								return res.json({
									success: true,
									token: 'JWT ' + token,
									user: foundUser
								})
							}
							return res.json({ success: false, msg: 'Wrong password' })
						})
				})
				.catch((err) => {
					console.log(err)
				})
		},
		testRoute(req, res){
			res.json({
				accessed: true,
				user: "123test"
			})
		}
	}
}