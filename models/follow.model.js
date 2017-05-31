const mongoose = require('mongoose')
const shortid = require('shortid')

const FollowSchema = mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  followerId: {
    type: String,
    required: true,
    index: true
  },
  followeeId: {
    type: String,
    required: true,
    index: true
  }
}, { timestamps: true, _id: false })

module.exports = mongoose.model('Follow', FollowSchema)
