const environments = require('../environments')

module.exports = {
  connectionString: (function () {
    if (environments.production) {
      return 'mongodb://localhost/dronexer-prod'
    } else {
      return 'mongodb://localhost/dronexer-dev'
    }
  }()),
  postsPerRequest: 10
}
