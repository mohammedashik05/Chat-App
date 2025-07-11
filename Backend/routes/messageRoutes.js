// Backend/routes/messageRoutes.js
const express = require("express");
const MSG = require("../models/message.js");

const router = express.Router();

// POST /msg/add
router.post('/add', async (req, res) => {
  try {
    const { text, email } = req.body;
    if (!text || !email) {
      return res.status(400).json({ success: false, message: 'text & email required' });
    }
    await MSG.create({ text, email });
    res.json({ success: true, message: 'Message saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET /msg/
router.get("/", async (req, res) => {
  try {
    const messages = await MSG.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
