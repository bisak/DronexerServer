const fs = require('fs')
const path = require('path')

module.exports = function (models) {
  let data = {}

  fs.readdirSync(__dirname)
    .filter(x => x.includes(".data"))
    .forEach(file => {
      let dataName = `${file.split('.')[0]}Data`;
      data[dataName] = require(path.join(__dirname, file))(models)
    });

  return data
}
