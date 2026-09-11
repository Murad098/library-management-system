const router = require("express").Router();
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const requireAuth = require("../middleware/auth");
const { hashPassword, verifyPassword } = require("../utils/password");

const MIN_PASSWORD_LENGTH = 6;

const clean = (value) => (typeof value === "string" ? value.trim() : "");

const signToken = (email) =>
  jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

// Sign in with the admin account. The first successful login using the
// credentials from the environment seeds the account into the database so
// that the password can be changed afterwards and persists.
router.post("/login", async (req, res) => {
  const email = clean(req.body.email).toLowerCase();
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      const envEmail = clean(process.env.ADMIN_EMAIL).toLowerCase();
      const envPassword = process.env.ADMIN_PASSWORD || "";

      if (!envEmail || email !== envEmail || password !== envPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const passwordHash = await hashPassword(password);

      await Admin.findOneAndUpdate(
        { email },
        { $setOnInsert: { email, passwordHash, updatedAt: new Date() } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return res.json({ token: signToken(email), email });
    }

    const isValid = await verifyPassword(password, admin.passwordHash);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({ token: signToken(admin.email), email: admin.email });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({ message: "Unable to sign in right now." });
  }
});

// Current session details.
router.get("/me", requireAuth, async (req, res) => {
  try {
    const email = clean(req.user?.email).toLowerCase();
    const admin = await Admin.findOne({ email }).select("email updatedAt");

    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    return res.json({
      email: admin.email,
      passwordUpdatedAt: admin.updatedAt,
    });
  } catch (error) {
    console.error("Session lookup error:", error);

    return res.status(500).json({ message: "Unable to load account." });
  }
});

// Change the admin password. Requires the current password.
router.post("/change-password", requireAuth, async (req, res) => {
  const currentPassword =
    typeof req.body.currentPassword === "string" ? req.body.currentPassword : "";
  const newPassword =
    typeof req.body.newPassword === "string" ? req.body.newPassword : "";

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current and new password are required." });
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
  }

  if (newPassword === currentPassword) {
    return res.status(400).json({
      message: "New password must be different from the current password.",
    });
  }

  try {
    const email = clean(req.user?.email).toLowerCase();
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    const isValid = await verifyPassword(currentPassword, admin.passwordHash);

    if (!isValid) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    admin.passwordHash = await hashPassword(newPassword);
    admin.updatedAt = new Date();

    await admin.save();

    return res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({ message: "Unable to update password." });
  }
});

module.exports = router;
