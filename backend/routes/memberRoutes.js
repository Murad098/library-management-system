const express = require("express");
const router = express.Router();

const Member = require("../models/Member");
const requireAuth = require("../middleware/auth");
const requireRole = requireAuth.requireRole;

const clean = (value) => (typeof value === "string" ? value.trim() : "");

// Add Member
router.post("/add", async (req, res) => {
  const name = clean(req.body.name);
  const email = clean(req.body.email);
  const phone = clean(req.body.phone);

  if (!name || !email || !phone) {
    return res.status(400).json({
      message: "Name, email and phone are required.",
    });
  }

  try {
    const member = new Member({
      name,
      email,
      phone,
      fee: Math.max(0, Number(req.body.fee) || 0),
      status: req.body.status === "paid" ? "paid" : "unpaid",
    });

    await member.save();

    res.status(201).json(member);
  } catch (error) {
    console.error("Error adding member:", error);

    res.status(500).json({
      message: "Unable to add member.",
    });
  }
});

// Get All Members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching members:", error);

    res.status(500).json({
      message: "Unable to load members.",
    });
  }
});

router.put("/:id", async (req, res) => {
  const name = clean(req.body.name);
  const email = clean(req.body.email);
  const phone = clean(req.body.phone);
  const fee = Number(req.body.fee);

  if (!name || !email || !phone || !Number.isFinite(fee) || fee < 0) {
    return res.status(400).json({ message: "Valid name, email, phone and fee are required." });
  }

  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, fee, status: req.body.status === "paid" ? "paid" : "unpaid" },
      { new: true, runValidators: true }
    );

    if (!member) return res.status(404).json({ message: "Member not found." });
    return res.status(200).json(member);
  } catch (error) {
    console.error("Error updating member:", error);
    return res.status(500).json({ message: "Unable to update member." });
  }
});

// Delete Member
router.delete("/:id", requireRole("owner"), async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found.",
      });
    }

    res.status(200).json({
      message: "Member deleted.",
    });
  } catch (error) {
    console.error("Error deleting member:", error);

    res.status(500).json({
      message: "Unable to delete member.",
    });
  }
});

module.exports = router;
