// Backend/routes/messageRoutes.js
const express = require("express");
const MSG = require("../models/message.js");

const router = express.Router();

// ✅ GET /msg/ — Fetch message history
router.get("/", async (req, res) => {
  try {
    const messages = await MSG.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
