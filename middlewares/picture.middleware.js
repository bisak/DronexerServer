const multer = require('multer')

const uploader = multer({
  limits: {
    /* Config uploader to deny files larger than 15mb */
    fileSize: 15 * 1000000
  },
  storage: multer.memoryStorage()
})

module.exports = () => {
  return {
    uploadSingle (fieldname) {
      return (req, res, next) => {
        uploader.single(fieldname)(req, res, next)
      }
    }
  }
}
