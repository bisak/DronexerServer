const mongoose = require('mongoose')
const shortid = require('shortid')

const UserSchema = mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  firstName: {
    type: String,
    required: true,
    minlength: 3
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    index: { unique: true, dropDups: true }
  },
  username: {
    type: String,
    minlength: 6,
    required: true,
    index: { unique: true, dropDups: true }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  drones: {
    type: [String]
  },
  followersCount: {
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0
  },
  followeesCount: {
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0
  },
  postsCount: {
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0
  },
  about: {
    type: String,
    default: ''
  },
  roles: {
    type: [String],
    default: ['normal'],
    enum: ['normal', 'admin']
  }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
