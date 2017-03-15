const mongoose = require('mongoose')

const PictureSchema = mongoose.Schema({
	filename: {
		type: String,
		required: true,
		index: true
	},
	uploaderUsername: {
		type: String,
		required: true,
		index: true
	},
	tags: {
		type: String,
		required: true,
		index: true
	},
	path: {
		type: String,
		required: true,
		index: { unique: true, dropDups: true }
	},
	uploadTimestamp: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	droneTaken: {
		type: String
	},
	metadata: {
		lat: {
			type: String
		},
		lng: {
			type: String
		},
		alt: {
			type: String
		},
		cameraModel: {
			type: String
		},
		dateTaken: {
			type: String
		},
		resolution: {}
	}
})

mongoose.model('Picture', PictureSchema);

module.exports = () => {
	return mongoose.model('Picture');
}