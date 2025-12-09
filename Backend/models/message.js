const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    email: { type: String, required: true }
  },
  { timestamps: true }  // <-- THIS ENABLES createdAt & updatedAt
);

module.exports = mongoose.model("Message", messageSchema);
