const mongoose = require('mongoose')
const shortid = require('shortid')

const CommentSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  dateCommented: {
    type: mongoose.SchemaTypes.Date,
    default: new Date,
    required: true
  }
}, {_id: false})

const MetadataSchema = mongoose.Schema({
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
}, {_id: false})

const PostSchema = mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  directory: {
    type: String,
    required: true
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
  comments: [CommentSchema],
  tags: {
    type: [String],
    index: true
  },
  likes: {
    type: [String]
  },
  metadata: MetadataSchema
}, {timestamps: true, _id: false})

PostSchema.index({createdAt: 1})
PostSchema.index({updatedAt: 1})

mongoose.model('Post', PostSchema)

module.exports = () => {
  return mongoose.model('Post')
}