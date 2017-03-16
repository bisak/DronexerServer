const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp');

const PictureSchema = mongoose.Schema({
	filename: {
		type: String,
		required: true
	},
	uploaderUsername: {
		type: String,
		required: true,
		index: true
	},
	tags: {
		type: [String],
		required: true,
		index: true
	},
	path: {
		type: String,
		required: true/*,
		 index: { unique: true, dropDups: true }*/
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
		makeModel: {
			type: String
		},
		dateTaken: {
			type: String
		},
	}
})
PictureSchema.plugin(timestamps);
mongoose.model('Picture', PictureSchema);

module.exports = () => {
	return mongoose.model('Picture');
}