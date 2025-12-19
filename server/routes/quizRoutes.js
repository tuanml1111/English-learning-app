const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuiz,
  submitQuizAttempt,
  getUserQuizAttempts,
  getLatestAttempt,
  getMyAttempts,
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getQuizzes);
router.get('/:id', getQuiz);

// Protected routes
router.post('/:id/submit', protect, submitQuizAttempt);
router.get('/:id/attempts', protect, getUserQuizAttempts);
router.get('/:id/latest-attempt', protect, getLatestAttempt);
router.get('/my/attempts', protect, getMyAttempts);

module.exports = router;
