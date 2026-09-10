const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");

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

  const parsedDate = req.body.date ? new Date(req.body.date) : new Date();

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

// Delete expense
router.delete("/:id", async (req, res) => {
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
