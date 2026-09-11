const { randomBytes, scrypt, timingSafeEqual } = require("crypto");
const { promisify } = require("util");

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, KEY_LENGTH);

  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(password, stored) {
  if (typeof password !== "string" || typeof stored !== "string") return false;

  const [salt, hash] = stored.split(":");

  if (!salt || !hash) return false;

  const expected = Buffer.from(hash, "hex");

  if (expected.length === 0) return false;

  const derived = await scryptAsync(password, salt, expected.length);

  return timingSafeEqual(expected, derived);
}

module.exports = { hashPassword, verifyPassword };
