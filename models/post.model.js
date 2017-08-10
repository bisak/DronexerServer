const mongoose = require('mongoose')
const shortid = require('shortid')

const PostSchema = mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  user: {
    type: String,
    required: true,
    index: true,
    ref: 'User'
  },
  fileLocation: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  droneTaken: {
    type: String,
    default: ''
  },
  isGenuine: {
    type: Boolean
  },
  likes: {
    type: [String],
    ref: 'User'
  },
  likesCount: {
    type: Number,
    default: 0
  },
  comments: {
    type: [String],
    ref: 'Comment'
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    index: true,
    default: []
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
}, { timestamps: true })

PostSchema.index({ createdAt: 1 })
PostSchema.index({ updatedAt: 1 })


module.exports = mongoose.model('Post', PostSchema)
