require("dotenv").config();  // MUST BE LINE 1

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const memberRoutes = require("./routes/memberRoutes");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/members", memberRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// DB 
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("DB Error:", err));

// Test
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;