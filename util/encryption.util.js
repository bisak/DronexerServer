const bcrypt = require('bcryptjs')

module.exports = {
	generateHash(password){
		return new Promise((resolve, reject) => {
			bcrypt.genSalt(10, function (err, salt) {
				bcrypt.hash(password, salt, function (err, hash) {
					if (err) return reject(err)
					resolve(hash)
				});
			});
		})
	},
	comparePassword(candidatePassword, hash){
		return new Promise((resolve, reject) => {
			bcrypt.compare(candidatePassword, hash).then(resolve).catch(reject)
		})
	}
}