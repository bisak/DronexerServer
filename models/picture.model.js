const mongoose = require('mongoose')

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
    userId: mongoose.SchemaTypes.ObjectId,
    comment: String
  }],
  tags: {
    type: [String],
    index: true
  },
  likes: {
    type: [mongoose.SchemaTypes.ObjectId]
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
}, {timestamps: true})

PictureSchema.index({createdAt: 1})
PictureSchema.index({updatedAt: 1})

mongoose.model('Picture', PictureSchema)

module.exports = () => {
  return mongoose.model('Picture')
}