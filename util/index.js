const fs = require('fs')
const path = require('path')

module.exports = function () {
  let utilities = {}

  fs.readdirSync(__dirname)
    .filter(x => x.includes(".util"))
    .forEach(file => {
      let utilityName = `${file.split('.')[0]}Util`;
      utilities[utilityName] = require(path.join(__dirname, file))()
    });

  return utilities
}