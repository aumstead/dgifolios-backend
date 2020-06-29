const mongoose = require('mongoose')

const { String, Number, ObjectId, Object } = mongoose.Schema.Types

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  resetToken: String,
  resetTokenExpiration: Date,
  age: {
    type: Number
  },
  preference1: {
    type: String
  },
  preference2: {
    type: String
  },
  preference3: {
    type: String
  },
  strategy: {
    type: String
  },
  goals: {
    type: String
  },
  following: [{
    idString: {
      type: String
    },
    username: {
      type: String
    },
    age: {
      type: Number
    },
    preference1: {
      type: String
    },
    preference2: {
      type: String
    },
    preference3: {
      type: String
    },
    strategy: {
      type: String
    },
    goals: {
      type: String
    }
  }],
  followers: [{
    idString: {
      type: String
    },
    username: {
      type: String
    },
    age: {
      type: Number
    },
    preference1: {
      type: String
    },
    preference2: {
      type: String
    },
    preference3: {
      type: String
    },
    strategy: {
      type: String
    },
    goals: {
      type: String
    }
  }]
})

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);