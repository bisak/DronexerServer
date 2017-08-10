const mongoose = require('mongoose')
const shortid = require('shortid')

const CommentSchema = mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  postId: {
    type: String,
    required: true,
    ref: 'Post',
    index: true
  },
  user: {
    type: String,
    required: true,
    ref: 'User'
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true })


module.exports = mongoose.model('Comment', CommentSchema)
