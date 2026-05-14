const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

// ─── Health Check (no DB needed) ─────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'Backend API is running ✅' }));

// ─── Mongoose Connection Cache (required for Vercel serverless) ───────────────
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // 10s timeout
    socketTimeoutMS: 45000,
  });
  isConnected = true;
  console.log('MongoDB Connected');
};

// Connect DB before every API request
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    res.status(500).json({ message: 'Database connection failed. Check MongoDB Atlas IP whitelist.' });
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

// ─── Start Server locally only — NOT on Vercel ────────────────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
