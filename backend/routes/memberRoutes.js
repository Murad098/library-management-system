const express = require("express");
const router = express.Router();

const Member = require("../models/Member");

// Add Member
router.post("/add", async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Get All Members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Delete Member
router.delete("/:id", async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);

    res.json({
      message: "Member deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;