const router = require("express").Router();
const jwt = require("jsonwebtoken");

const admin = {
  email: "admin@gmail.com",
  password: "123456"
};

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== admin.email || password !== admin.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, "secretkey", { expiresIn: "1h" });

  res.json({ token });
});

module.exports = router;