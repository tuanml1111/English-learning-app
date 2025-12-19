const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Compression middleware
app.use(compression());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/flashcards', require('./routes/flashcardRoutes'));
app.use('/api/folders', require('./routes/folderRoutes'));
app.use('/api/readings', require('./routes/readingRoutes'));
app.use('/api/grammar', require('./routes/grammarRoutes'));
app.use('/api/vocabulary', require('./routes/vocabularyRoutes'));
app.use('/api/dictionary', require('./routes/dictionaryRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
