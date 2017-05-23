const bcrypt = require('bcryptjs')

module.exports = {
  generateHash (password) {
    return bcrypt.genSalt(10).then(salt => bcrypt.hash(password, salt))
  },
  comparePassword (candidatePassword, hash) {
    return bcrypt.compare(candidatePassword, hash)
  }
}
