const path = require('path')

module.exports = {
  port: process.env.PORT || 8080,
  storagePath: path.join('storage', 'pictures'),
  profilePicPath: path.join('storage', 'profile_pictures'),
  logosPath: path.join('storage', 'logos'),
  production: false
}

/*TODO add profile pictures path here too.*/