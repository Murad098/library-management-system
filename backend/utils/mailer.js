const nodemailer = require("nodemailer");

// SMTP settings are read lazily so the server can start (and report a clear
// error) even before an email provider is configured.
const readConfig = () => ({
  host: process.env.SMTP_HOST || "",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  from: process.env.MAIL_FROM || "",
});

const isMailConfigured = () => {
  const { host, from } = readConfig();

  return Boolean(host && from);
};

const sendOtpEmail = async (to, otp) => {
  const { host, port, secure, user, pass, from } = readConfig();

  if (!host || !from) {
    throw new Error("Email service is not configured.");
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  const text = [
    `Your MemberStack password reset code is ${otp}.`,
    "",
    "It expires in 10 minutes. If you did not request this, ignore this email.",
  ].join("\n");

  const html = [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.5;color:#0f172a">',
    "<p>Your MemberStack password reset code is:</p>",
    `<p style="font-size:28px;font-weight:700;letter-spacing:6px;margin:12px 0">${otp}</p>`,
    '<p style="color:#64748b;font-size:13px">It expires in 10 minutes. If you did not request this, ignore this email.</p>',
    "</div>",
  ].join("");

  await transport.sendMail({
    from,
    to,
    subject: `${otp} is your MemberStack verification code`,
    text,
    html,
  });
};

module.exports = { isMailConfigured, sendOtpEmail };
