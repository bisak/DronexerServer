const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const PictureSchema = mongoose.Schema({
  uploaderUsername: {
    type: String,
    required: true,
    index: true
  },
  directory: {
    type: String,
    required: true/*,
     index: { unique: true, dropDups: true } */
  },
  fileName: {
    type: String,
    required: true
  },
  caption: {
    type: String
  },
  droneTaken: {
    type: String
  },
  isGenuine: {
    type: Boolean
  },
  comments: [{
    userId: String,
    comment: String
  }],
  tags: {
    type: [String],
    index: true
  },
  likes: {
    type: [String]
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
    make: {
      type: String
    },
    model: {
      type: String
    },
    dateTaken: {
      type: String
    }
  }
})
PictureSchema.plugin(timestamps)
mongoose.model('Picture', PictureSchema)

module.exports = () => {
  return mongoose.model('Picture')
}
