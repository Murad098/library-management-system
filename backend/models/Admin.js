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

  resetOtpHash: {
    type: String,
    default: null,
  },

  resetOtpExpiresAt: {
    type: Date,
    default: null,
  },

  resetOtpAttempts: {
    type: Number,
    default: 0,
  },

  resetOtpSentAt: {
    type: Date,
    default: null,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
