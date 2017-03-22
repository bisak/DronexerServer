const fs = require('fs')
const path = require('path')

module.exports = function () {
  let models = {}

  fs.readdirSync(__dirname)
    .filter(x => x.includes(".model"))
    .forEach(file => {
      let modelName = `${file.split('.')[0]}Model`;
      models[modelName] = require(path.join(__dirname, file))()
    });

  return models
}