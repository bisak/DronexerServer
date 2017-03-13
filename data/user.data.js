const bcrypt = require('bcryptjs')
const encryption = require('../util').encryption

module.exports = (models) => {
	const User = models.User
	return {
		registerUser(newUser){
			return encryption.generateHash(newUser.password)
				.then((hash) => {
					newUser.password = hash
					return User.create(newUser)
				})
				.catch((error) => {
					console.log(error)
				})
		},
		getUserById(id){
			return User.findById(id)
		},
		getUserByUsername(username){
			const query = { username: username }
			return User.findOne(query)
		}
	}
}