const bcrypt = require('bcryptjs')
const encryption = require('../util').encryption

module.exports = (models) => {
	const User = models.User
	return {
		registerUser(newUser){
			return new Promise((resolve, reject) => {
				encryption.generateHash(newUser.password)
					.then((hash) => {
						newUser.password = hash
						return User.create(newUser).then(resolve).catch(reject)
					})
					.catch((error) => {
						console.log(error)
					})
			})
		},
		getUserById(id){
			return new Promise((resolve, reject) => {
				User.findById(id).then(resolve).catch(reject)
			})
		},
		getUserByUsername(username){
			return new Promise((resolve, reject) => {
				const query = { username: username }
				User.findOne(query).then(resolve).catch(reject)
			})
		}
	}
}