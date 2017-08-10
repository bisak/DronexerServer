const multer = require('multer')

const uploader = multer({
  limits: {
    /* Config uploader to not accept files larger than 10mb */
    fileSize: 20 * 1000000
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
