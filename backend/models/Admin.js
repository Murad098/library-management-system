const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  avatar: {
    type: Buffer,
    default: null,
  },

  avatarContentType: {
    type: String,
    default: null,
  },

  avatarUpdatedAt: {
    type: Date,
    default: null,
  },

  recoveryCodeHash: {
    type: String,
    default: null,
  },

  recoveryCodeCreatedAt: {
    type: Date,
    default: null,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
