const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  prediction: {
    type: String, // 'Fake' or 'Genuine'
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  sentiment: {
    type: String, // 'Positive', 'Negative', 'Neutral'
    required: true,
  },
  suspiciousWords: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', ReviewSchema);
