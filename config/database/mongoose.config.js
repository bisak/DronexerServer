const environments = require('../environments')

module.exports = {
  connectionString: function () {
    if (environments.production) {
      return 'mongodb://localhost/dronexer-prod'
    } else if (environments.development) {
      return 'mongodb://localhost/dronexer-dev'
    }
  }(),
  postsPerRequest: 5
}