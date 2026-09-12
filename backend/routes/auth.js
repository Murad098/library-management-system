const crypto = require("crypto");

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");

const Admin = require("../models/Admin");
const requireAuth = require("../middleware/auth");
const { hashPassword, verifyPassword } = require("../utils/password");

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

// Recovery codes let the single admin account set a new password without
// any email service. The code is shown once, stored only as a hash, and
// cleared as soon as it is used.
const RECOVERY_CODE_BYTES = 8;
const RESET_WINDOW_MS = 15 * 60 * 1000;
const RESET_MAX_ATTEMPTS = 10;
const resetAttempts = new Map();

const normalizeCode = (value) =>
  (typeof value === "string" ? value : "")
    .replace(/[\s-]/g, "")
    .toUpperCase();

const createRecoveryCode = () =>
  crypto
    .randomBytes(RECOVERY_CODE_BYTES)
    .toString("hex")
    .toUpperCase()
    .replace(/(.{4})(?=.)/g, "$1-");

const constantTimeEqual = (a, b) => {
  const left = crypto.createHash("sha256").update(String(a)).digest();
  const right = crypto.createHash("sha256").update(String(b)).digest();

  return crypto.timingSafeEqual(left, right);
};

const isRateLimited = (key) => {
  const now = Date.now();
  const entry = resetAttempts.get(key);

  if (!entry || now - entry.start > RESET_WINDOW_MS) {
    resetAttempts.set(key, { start: now, count: 1 });

    return false;
  }

  entry.count += 1;

  return entry.count > RESET_MAX_ATTEMPTS;
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

// Create a fresh single-use recovery code for the signed-in admin. The
// plaintext is returned once and never stored in readable form.
router.post("/recovery-code", requireAuth, async (req, res) => {
  try {
    const email = clean(req.user?.email).toLowerCase();
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    const code = createRecoveryCode();

    admin.recoveryCodeHash = await hashPassword(normalizeCode(code));
    admin.recoveryCodeCreatedAt = new Date();

    await admin.save();

    return res.json({ recoveryCode: code });
  } catch (error) {
    console.error("Recovery code error:", error);

    return res
      .status(500)
      .json({ message: "Unable to create a recovery code." });
  }
});

// Reset the admin password with a recovery code. Public by design (the
// admin is locked out) but requires the code, and is rate limited.
router.post("/reset-password", async (req, res) => {
  const email = clean(req.body.email).toLowerCase();
  const code = normalizeCode(req.body.code);
  const newPassword =
    typeof req.body.newPassword === "string" ? req.body.newPassword : "";

  if (isRateLimited(req.ip || "unknown")) {
    return res
      .status(429)
      .json({ message: "Too many attempts. Please try again later." });
  }

  if (!email || !code || !newPassword) {
    return res.status(400).json({
      message: "Email, recovery code and new password are required.",
    });
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({
      message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or recovery code." });
    }

    const matchesStored = admin.recoveryCodeHash
      ? await verifyPassword(code, admin.recoveryCodeHash)
      : false;

    const envCode =
      typeof process.env.ADMIN_RESET_CODE === "string"
        ? normalizeCode(process.env.ADMIN_RESET_CODE)
        : "";

    const matchesEnv = envCode ? constantTimeEqual(code, envCode) : false;

    if (!matchesStored && !matchesEnv) {
      return res.status(401).json({ message: "Invalid email or recovery code." });
    }

    if (await verifyPassword(newPassword, admin.passwordHash)) {
      return res.status(400).json({
        message: "New password must be different from the current password.",
      });
    }

    admin.passwordHash = await hashPassword(newPassword);
    admin.updatedAt = new Date();
    admin.recoveryCodeHash = null;
    admin.recoveryCodeCreatedAt = null;

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
