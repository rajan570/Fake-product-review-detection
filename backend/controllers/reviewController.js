const Review = require('../models/Review');
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');

// Helper to call ML microservice
const analyzeReview = async (text) => {
  try {
    const response = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, { review: text });
    return response.data; // { prediction, confidence, sentiment, suspicious_words }
  } catch (error) {
    console.error('Error calling ML service:', error.message);
    throw new Error('ML Service Error');
  }
};

// @desc    Submit a single review for analysis
// @route   POST /api/reviews
// @access  Private
exports.submitReview = async (req, res) => {
  const { productName, reviewText } = req.body;

  try {
    const analysis = await analyzeReview(reviewText);

    const review = new Review({
      user: req.user._id,
      productName,
      reviewText,
      prediction: analysis.prediction,
      confidence: analysis.confidence,
      sentiment: analysis.sentiment,
      suspiciousWords: analysis.suspicious_words || []
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing review', error: error.message });
  }
};

// @desc    Upload CSV for bulk analysis
// @route   POST /api/reviews/upload
// @access  Private
exports.uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a CSV file' });
  }

  const results = [];
  const errors = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      // Assuming CSV has columns: productName, reviewText
      if (data.productName && data.reviewText) {
        results.push(data);
      }
    })
    .on('end', async () => {
      fs.unlinkSync(req.file.path); // Remove file after parsing

      const analyzedReviews = [];
      for (const item of results) {
        try {
          const analysis = await analyzeReview(item.reviewText);
          
          const review = new Review({
            user: req.user._id,
            productName: item.productName,
            reviewText: item.reviewText,
            prediction: analysis.prediction,
            confidence: analysis.confidence,
            sentiment: analysis.sentiment,
            suspiciousWords: analysis.suspicious_words || []
          });

          await review.save();
          analyzedReviews.push(review);
        } catch (error) {
          errors.push(`Failed to analyze review for ${item.productName}`);
        }
      }

      res.status(200).json({
        message: `Successfully analyzed ${analyzedReviews.length} reviews`,
        reviews: analyzedReviews,
        errors
      });
    });
};

// @desc    Get user's reviews
// @route   GET /api/reviews/myreviews
// @access  Private
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      await Review.deleteOne({ _id: review._id });
      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get stats for dashboard
// @route   GET /api/reviews/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const fakeReviews = await Review.countDocuments({ prediction: 'Fake' });
    const genuineReviews = await Review.countDocuments({ prediction: 'Genuine' });
    
    // Aggregate by sentiment
    const sentimentStats = await Review.aggregate([
      { $group: { _id: '$sentiment', count: { $sum: 1 } } }
    ]);

    res.json({
      totalReviews,
      fakeReviews,
      genuineReviews,
      sentimentStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
