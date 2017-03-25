const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
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
    index: { unique: true, dropDups: true }
  },
  username: {
    type: String,
    minlength: 4,
    required: true,
    index: { unique: true, dropDups: true }
  },
  password: {
    type: String,
    required: true
  },
  drones: {
    type: [String]
  },
  birthday: {
    type: String
  },
  dateRegistered: {
    type: String
  },
  following: {
    type: [String]
  },
  followers: {
    type: [String]
  },
  hasProfilePicture: {
    type: Boolean,
    default: false
  },
  roles: {
    type: [String],
    default: ['normal'],
    enum: ['normal', 'admin']
  }
})

mongoose.model('User', UserSchema);

module.exports = () => {
  return mongoose.model('User');
}