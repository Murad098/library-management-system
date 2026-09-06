const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // e.g. "Rent", "Electricity", "Internet"
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["Rent", "Electricity", "Internet", "Maintenance", "Other"],
    default: "Other",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);