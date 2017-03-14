const bcrypt = require('bcryptjs')

module.exports = function () {
	return {
		generateHash(password){
			return bcrypt.genSalt(10).then(salt => bcrypt.hash(password, salt)).catch(console.log);
		},
		comparePassword(candidatePassword, hash){
			return bcrypt.compare(candidatePassword, hash).catch(console.log)
		}
	}
}