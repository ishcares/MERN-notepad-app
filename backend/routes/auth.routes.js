const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const router = express.Router();

// 🟢 LOGIN
router.post("/login", async (req, res) => {
  try {
    // 🛑 CRITICAL FIX: Check if req.body exists to prevent 502 crash
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Request body required." });
    }

    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // check password (plain-text)
    if (user.password !== password)
      return res.status(401).json({ success: false, message: "Invalid password" });

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

    res.json({ success: true, token, user: { id: user._id, email: user.email, fullName: user.fullName } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🟣 SIGNUP
router.post("/create-account", async (req, res) => {
  try {
    // 🛑 CRITICAL FIX: Check if req.body exists... (kept for safety)
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Request body required." });
    }

    const { fullName, email, password, securityQuestion, securityAnswer } = req.body; 
    
    // Check for missing fields
    if (!fullName || !email || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "User already exists" });

    const newUser = new User({ 
      fullName, 
      email, 
      password,
      securityQuestion,
      securityAnswer: securityAnswer.trim().toLowerCase()
    }); 
    await newUser.save();

    // generate token for auto-login
    const token = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

    res.status(201).json({ 
      success: true, 
      message: "Account created successfully",
      token,
      user: { id: newUser._id, email: newUser.email, fullName: newUser.fullName }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔍 GET SECURITY QUESTION FOR PASSWORD RESET
router.post("/forgot-password/question", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, question: user.securityQuestion });
  } catch (err) {
    console.error("Fetch question error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔄 VERIFY SECURITY ANSWER AND RESET PASSWORD
router.post("/forgot-password/reset", async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.securityAnswer.toLowerCase().trim() !== securityAnswer.toLowerCase().trim()) {
      return res.status(400).json({ success: false, message: "Incorrect security answer." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;