const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
 bookId: { type: String, required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  date: { type: String, required: true }
});

module.exports = mongoose.model('Review', ReviewSchema);
