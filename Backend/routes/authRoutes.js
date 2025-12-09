require("dotenv").config(); // 🔁 Add this line FIRST

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware");
const USER = require("../models/user");

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;


// ✅ Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const existingUser = await USER.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new USER({ email, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: `Welcome ${newUser.email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Signup failed" });
  }
});

// ✅ Signin/Login Route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("SECRET_KEY in /signin route:", SECRET_KEY);

    const user = await USER.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ success: true, message: "Login successful", token ,userId:user._id ,email:user.email});
    

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Reset Password Route
router.put("/reset/:id", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const updatedUser = await USER.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: `Password updated for ${updatedUser.email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
});

// ✅ Protected Route Example
router.get("/user", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: `Welcome user ${req.user.email}`,
    decoded: req.user,
  });
});

//get by user id
router.get("/user/:id", async (req, res) => {
  try {
    const user = await USER.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
});


module.exports = router;
