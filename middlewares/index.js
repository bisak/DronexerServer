const fs = require('fs')
const path = require('path')

module.exports = function () {
  let middlewares = {}

  fs.readdirSync(__dirname)
    .filter(x => x.includes(".middleware"))
    .forEach(file => {
      let middleWareName = `${file.split('.')[0]}Middleware`;
      middlewares[middleWareName] = require(path.join(__dirname, file))()
    });

  return middlewares
}


