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
    minlength: 3,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    index: {unique: true, dropDups: true}
  },
  username: {
    type: String,
    minlength: 4,
    required: true,
    index: {unique: true, dropDups: true}
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  drones: {
    type: [String]
  },
  birthday: {
    type: String
  },
  following: {
    type: [String]
  },
  followers: {
    type: [String]
  },
  about: {
    type: String
  },
  roles: {
    type: [String],
    default: ['normal'],
    enum: ['normal', 'admin']
  }
}, {timestamps: true, _id: false})

mongoose.model('User', UserSchema);

module.exports = () => {
  return mongoose.model('User');
}