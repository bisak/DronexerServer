const encryption = require('../util')().encryptionUtility

module.exports = (models) => {
	const User = models.userModel
	return {
		registerUser(newUser){
			return encryption.generateHash(newUser.password)
				.then((hash) => {
					newUser.password = hash
					return User.create(newUser)
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