const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  thumbnail: { type: String },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reel", reelSchema);
