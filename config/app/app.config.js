module.exports = {
  port: process.env.PORT || 8080,
  storagePath: require('path').join('storage', 'pictures'),
  production: false
}

/*TODO add profile pictures path here too.*/