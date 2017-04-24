const fs = require('fs')
const path = require('path')

/*UNUSED*/
module.exports = () => {
  return {
    loadModule(moduleExt){
      let modules = {}

      let ext = moduleExt;

      fs.readdirSync(__dirname)
      console.log(__dirname)
        .filter(x => x.includes(`.${ext.toLowerCase()}`))
        .forEach(file => {
          let moduleName = `${file.split('.')[0]}${ext}`;
          modules[moduleName] = require(path.join(__dirname, file))(controllers, middlewares)
          /*TODO finish this.*/
        });
    }
  }
}