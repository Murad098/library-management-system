const router = require("express").Router();

const Expense = require("../models/Expense");

// Add new expense
router.post("/add", async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      amount: Number(req.body.amount),
    });

    await expense.save();

    res.status(201).json(expense);
  } catch (err) {
    console.error("Error adding expense:", err);

    res.status(500).json({
      message: "Error adding expense",
      error: err.message,
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
      message: "Error fetching expenses",
      error: err.message,
    });
  }
});

// Delete expense
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(
      req.params.id
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense deleted",
    });
  } catch (err) {
    console.error("Error deleting expense:", err);

    res.status(500).json({
      message: "Error deleting expense",
      error: err.message,
    });
  }
});

module.exports = router;