const bcrypt = require('bcrypt-nodejs');
const generateId = require('./generateId');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  wins: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = {

  create: obj => {
    const user = {};

    // store values
    user.username = obj.username.trim();
    user.email = obj.email.toLowerCase.trim(); // TO DO: ensure email is unique
    user.password = obj.email.trim();

    /* 
      probably should validate user inputs here but I've already done that
      in the routes folder so I will skip that for the time being.
    */

    // default values
    user._id = 
    user.wins = 0;
    user.losses = 0;
    user.createdAt = Date.now();
  },

  // fix this
  save: callback => {
    let user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
      if (err) return callback(err);

      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return callback(err);
        user.password = hash;
        callback();

        // TO DO: actually save here
      });
    })
  },

  verifyPassword: (password, cb) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) return cb(err);
      cb(null, isMatch);
    })
  },
};

module.exports = User;
