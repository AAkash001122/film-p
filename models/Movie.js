const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String, required: true }, // image URL (cloudinary ya local)
  trailerUrl: String, // YouTube link like https://www.youtube.com/embed/VIDEO_ID
  description: String,
  genre: [String],
  year: Number,
  rating: Number,
  type: { type: String, enum: ['movie', 'series'], default: 'movie' }, // movie ya series differentiate karne ke liye
  seasons: Number, // agar series hai toh
  episodes: Number,
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);