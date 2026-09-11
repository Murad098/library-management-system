const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");

const TYPES = ["info", "success", "warning", "alert"];

const clean = (value) => (typeof value === "string" ? value.trim() : "");

// List notifications (newest first) with the unread count.
router.get("/", async (req, res) => {
  try {
    const [notifications, unread] = await Promise.all([
      Notification.find().sort({ createdAt: -1 }).limit(100),
      Notification.countDocuments({ read: false }),
    ]);

    res.status(200).json({ notifications, unread });
  } catch (error) {
    console.error("Error fetching notifications:", error);

    res.status(500).json({ message: "Unable to load notifications." });
  }
});

// Create a notification.
router.post("/add", async (req, res) => {
  const title = clean(req.body.title);
  const message = clean(req.body.message);

  if (!title) {
    return res.status(400).json({ message: "Notification title is required." });
  }

  try {
    const notification = await Notification.create({
      title,
      message,
      type: TYPES.includes(req.body.type) ? req.body.type : "info",
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error adding notification:", error);

    res.status(500).json({ message: "Unable to add notification." });
  }
});

// Mark every unread notification as read.
router.post("/read-all", async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { read: false },
      { read: true }
    );

    res.status(200).json({ updated: result.modifiedCount });
  } catch (error) {
    console.error("Error marking notifications read:", error);

    res.status(500).json({ message: "Unable to update notifications." });
  }
});

// Toggle a single notification's read state.
router.patch("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    notification.read = req.body.read === false ? false : true;

    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error updating notification:", error);

    res.status(500).json({ message: "Unable to update notification." });
  }
});

// Delete a notification.
router.delete("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification deleted." });
  } catch (error) {
    console.error("Error deleting notification:", error);

    res.status(500).json({ message: "Unable to delete notification." });
  }
});

module.exports = router;
