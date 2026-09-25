const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");
const requireAuth = require("../middleware/auth");
const requireRole = requireAuth.requireRole;

const parseLocalDateString = (value) => {
  if (!value) return new Date();
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value + "T00:00:00");
  }
  return new Date(value);
};

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];

// Add new expense
router.post("/add", async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const amount = Number(req.body.amount);

  if (!title) {
    return res.status(400).json({
      message: "Expense title is required.",
    });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({
      message: "Amount must be greater than zero.",
    });
  }

  const parsedDate = parseLocalDateString(req.body.date);

  try {
    const expense = new Expense({
      title,
      amount,
      category: CATEGORIES.includes(req.body.category)
        ? req.body.category
        : "Other",
      date: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
    });

    await expense.save();

    res.status(201).json(expense);
  } catch (err) {
    console.error("Error adding expense:", err);

    res.status(500).json({
      message: "Unable to add expense.",
    });
  }
});

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({
      date: -1,
    });

    res.status(200).json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);

    res.status(500).json({
      message: "Unable to load expenses.",
    });
  }
});

router.put("/:id", async (req, res) => {
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const amount = Number(req.body.amount);
  const parsedDate = parseLocalDateString(req.body.date);

  if (!title || !Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: "Valid title and amount are required." });
  }

  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title,
        amount,
        category: CATEGORIES.includes(req.body.category) ? req.body.category : "Other",
        date: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
      },
      { new: true, runValidators: true }
    );

    if (!expense) return res.status(404).json({ message: "Expense not found." });
    return res.status(200).json(expense);
  } catch (err) {
    console.error("Error updating expense:", err);
    return res.status(500).json({ message: "Unable to update expense." });
  }
});

// Delete expense
router.delete("/:id", requireRole("owner"), async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found.",
      });
    }

    res.status(200).json({
      message: "Expense deleted.",
    });
  } catch (err) {
    console.error("Error deleting expense:", err);

    res.status(500).json({
      message: "Unable to delete expense.",
    });
  }
});

module.exports = router;
