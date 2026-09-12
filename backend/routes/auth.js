const crypto = require("crypto");

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");

const Admin = require("../models/Admin");
const requireAuth = require("../middleware/auth");
const { hashPassword, verifyPassword } = require("../utils/password");
const { isMailConfigured, sendOtpEmail } = require("../utils/mailer");

const MIN_PASSWORD_LENGTH = 6;
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: AVATAR_MAX_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!AVATAR_TYPES.has(file.mimetype)) {
      return cb(new Error("Unsupported image type. Use a JPG, PNG or WebP."));
    }

    return cb(null, true);
  },
});

const clean = (value) => (typeof value === "string" ? value.trim() : "");

// Password reset uses a short-lived numeric one-time code (OTP) emailed only
// to the administrator account. The code is stored as a hash, is single-use,
// and can be tried a handful of times before it must be requested again.
const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const RESET_TOKEN_TTL = "15m";
const RESET_TOKEN_PURPOSE = "admin-password-reset";
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_REQUESTS = 10;
const requestLog = new Map();

const createOtp = () =>
  String(crypto.randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");

const configuredAdminEmail = () =>
  clean(process.env.ADMIN_EMAIL).toLowerCase();

// Only the configured administrator email is eligible. If the account has not
// been seeded into the database yet, create it so the OTP has somewhere to
// live; the reset itself sets the real password.
const findOrSeedAdmin = async (email) => {
  const existing = await Admin.findOne({ email });

  if (existing) return existing;

  if (email !== configuredAdminEmail()) return null;

  return Admin.create({
    email,
    passwordHash: await hashPassword(
      process.env.ADMIN_PASSWORD || crypto.randomBytes(24).toString("hex")
    ),
  });
};

const isRateLimited = (key) => {
  const now = Date.now();
  const entry = requestLog.get(key);

  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    requestLog.set(key, { start: now, count: 1 });

    return false;
  }

  entry.count += 1;

  return entry.count > RATE_MAX_REQUESTS;
};

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

// Upload the admin profile photo. Stored in MongoDB as raw bytes so the
// app needs no external object storage.
router.post("/avatar", requireAuth, (req, res) => {
  uploadAvatar.single("avatar")(req, res, async (uploadError) => {
    if (uploadError) {
      const message =
        uploadError.code === "LIMIT_FILE_SIZE"
          ? "Image must be 2 MB or smaller."
          : uploadError.message || "Unable to read the uploaded image.";

      return res.status(400).json({ message });
    }

    if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ message: "Choose an image to upload." });
    }

    try {
      const email = clean(req.user?.email).toLowerCase();
      const admin = await Admin.findOne({ email });

      if (!admin) {
        return res.status(404).json({ message: "Admin account not found." });
      }

      admin.avatar = req.file.buffer;
      admin.avatarContentType = req.file.mimetype;
      admin.avatarUpdatedAt = new Date();

      await admin.save();

      return res.json({
        message: "Profile photo updated.",
        avatarUpdatedAt: admin.avatarUpdatedAt,
      });
    } catch (error) {
      console.error("Avatar upload error:", error);

      return res
        .status(500)
        .json({ message: "Unable to save the profile photo." });
    }
  });
});

// Serve the stored profile photo.
router.get("/avatar", requireAuth, async (req, res) => {
  try {
    const email = clean(req.user?.email).toLowerCase();
    const admin = await Admin.findOne({ email }).select(
      "avatar avatarContentType"
    );

    if (!admin || !admin.avatar || admin.avatar.length === 0) {
      return res.status(404).json({ message: "No profile photo set." });
    }

    res.set("Content-Type", admin.avatarContentType || "image/jpeg");
    res.set("Cache-Control", "private, no-store");

    return res.send(admin.avatar);
  } catch (error) {
    console.error("Avatar lookup error:", error);

    return res.status(500).json({ message: "Unable to load the profile photo." });
  }
});

const GENERIC_RESET_MESSAGE =
  "If that email belongs to the administrator account, a reset code is on its way.";

// Step 1 — request a reset code. Only the administrator email receives a code.
// The response is deliberately generic so it never reveals whether an account
// exists for the address.
router.post("/forgot-password", async (req, res) => {
  const email = clean(req.body.email).toLowerCase();

  if (isRateLimited(`forgot:${req.ip || "unknown"}`)) {
    return res
      .status(429)
      .json({ message: "Too many requests. Please try again later." });
  }

  if (!email) {
    return res
      .status(400)
      .json({ message: "Enter the administrator email address." });
  }

  if (!isMailConfigured()) {
    return res.status(503).json({
      message:
        "Email delivery is not configured. Set the SMTP settings and try again.",
    });
  }

  try {
    const admin = await findOrSeedAdmin(email);

    if (!admin) {
      return res.json({ message: GENERIC_RESET_MESSAGE });
    }

    if (
      admin.resetOtpSentAt &&
      Date.now() - admin.resetOtpSentAt.getTime() < OTP_RESEND_COOLDOWN_MS
    ) {
      return res.status(429).json({
        message: "A code was just sent. Please wait a minute before retrying.",
      });
    }

    const otp = createOtp();

    admin.resetOtpHash = await hashPassword(otp);
    admin.resetOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
    admin.resetOtpAttempts = 0;
    admin.resetOtpSentAt = new Date();

    await admin.save();

    try {
      await sendOtpEmail(admin.email, otp);
    } catch (error) {
      admin.resetOtpHash = null;
      admin.resetOtpExpiresAt = null;
      admin.resetOtpSentAt = null;

      await admin.save();

      console.error("OTP email error:", error);

      return res
        .status(502)
        .json({ message: "Unable to send the reset email right now." });
    }

    return res.json({ message: GENERIC_RESET_MESSAGE });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res
      .status(500)
      .json({ message: "Unable to start the reset right now." });
  }
});

// Step 2 — verify the emailed code. On success the code is consumed and a
// short-lived token is returned that authorises the password change.
router.post("/verify-otp", async (req, res) => {
  const email = clean(req.body.email).toLowerCase();
  const otp = clean(req.body.otp).replace(/\s/g, "");

  if (isRateLimited(`verify:${req.ip || "unknown"}`)) {
    return res
      .status(429)
      .json({ message: "Too many attempts. Please try again later." });
  }

  if (!email || !otp) {
    return res
      .status(400)
      .json({ message: "Enter the code sent to your email." });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || !admin.resetOtpHash || !admin.resetOtpExpiresAt) {
      return res
        .status(400)
        .json({ message: "Request a new code to continue." });
    }

    if (admin.resetOtpExpiresAt.getTime() < Date.now()) {
      admin.resetOtpHash = null;
      admin.resetOtpExpiresAt = null;
      admin.resetOtpAttempts = 0;

      await admin.save();

      return res
        .status(400)
        .json({ message: "That code has expired. Request a new one." });
    }

    if (admin.resetOtpAttempts >= OTP_MAX_ATTEMPTS) {
      admin.resetOtpHash = null;
      admin.resetOtpExpiresAt = null;
      admin.resetOtpAttempts = 0;

      await admin.save();

      return res.status(429).json({
        message: "Too many incorrect codes. Request a new one.",
      });
    }

    const isValid = await verifyPassword(otp, admin.resetOtpHash);

    if (!isValid) {
      admin.resetOtpAttempts += 1;

      await admin.save();

      return res.status(401).json({ message: "That code is not correct." });
    }

    // The code is single-use: clear it the moment it is verified.
    admin.resetOtpHash = null;
    admin.resetOtpExpiresAt = null;
    admin.resetOtpAttempts = 0;

    await admin.save();

    const resetToken = jwt.sign(
      { email: admin.email, purpose: RESET_TOKEN_PURPOSE },
      process.env.JWT_SECRET,
      { expiresIn: RESET_TOKEN_TTL }
    );

    return res.json({ resetToken });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res
      .status(500)
      .json({ message: "Unable to verify the code right now." });
  }
});

// Step 3 — set the new password using the token issued after OTP verification.
router.post("/reset-password", async (req, res) => {
  const resetToken =
    typeof req.body.resetToken === "string" ? req.body.resetToken : "";
  const newPassword =
    typeof req.body.newPassword === "string" ? req.body.newPassword : "";

  if (isRateLimited(`reset:${req.ip || "unknown"}`)) {
    return res
      .status(429)
      .json({ message: "Too many attempts. Please try again later." });
  }

  if (!resetToken || !newPassword) {
    return res
      .status(400)
      .json({ message: "The reset session and a new password are required." });
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
  }

  let payload;

  try {
    payload = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch (error) {
    return res
      .status(401)
      .json({ message: "This reset session has expired. Start again." });
  }

  if (payload?.purpose !== RESET_TOKEN_PURPOSE || !payload.email) {
    return res
      .status(401)
      .json({ message: "This reset session is not valid. Start again." });
  }

  try {
    const email = clean(payload.email).toLowerCase();
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(404)
        .json({ message: "Administrator account not found." });
    }

    if (await verifyPassword(newPassword, admin.passwordHash)) {
      return res.status(400).json({
        message: "New password must be different from the current password.",
      });
    }

    admin.passwordHash = await hashPassword(newPassword);
    admin.updatedAt = new Date();
    admin.resetOtpHash = null;
    admin.resetOtpExpiresAt = null;
    admin.resetOtpAttempts = 0;
    admin.resetOtpSentAt = null;

    await admin.save();

    return res.json({
      message: "Password reset successfully. You can sign in now.",
    });
  } catch (error) {
    console.error("Password reset error:", error);

    return res.status(500).json({ message: "Unable to reset the password." });
  }
});

module.exports = router;
