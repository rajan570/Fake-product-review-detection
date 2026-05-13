const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  submitReview,
  uploadCSV,
  getMyReviews,
  getReviews,
  deleteReview,
  getStats
} = require('../controllers/reviewController');

// Multer config for CSV upload
const upload = multer({ dest: 'uploads/' });

router.post('/', protect, submitReview);
router.post('/upload', protect, upload.single('file'), uploadCSV);
router.get('/myreviews', protect, getMyReviews);
router.get('/', protect, admin, getReviews);
router.delete('/:id', protect, admin, deleteReview);
router.get('/stats', protect, admin, getStats);

module.exports = router;
