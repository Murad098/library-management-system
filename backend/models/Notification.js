const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  message: {
    type: String,
    default: "",
    trim: true,
  },

  type: {
    type: String,
    enum: ["info", "success", "warning", "alert"],
    default: "info",
  },

  read: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
