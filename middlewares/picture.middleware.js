const multer = require('multer')

const uploader = multer({
	limits: {
		fileSize: 10 * 1000000
	}
	/*Config uploader to not accept files larger than 10mb*/
})

module.exports = () => {
	return {
		uploadSingle(fieldname) {
			return (req, res, next) => {
				uploader.single(fieldname)(req, res, next)
			}
		}
	}
}
