const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getFlashcards,
  getFlashcard,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  updateReviewStatus,
  getDueFlashcards,
  createBulkFlashcards,
  resetFolderProgress,
} = require('../controllers/flashcardController');

router.get('/due', protect, getDueFlashcards);
router.post('/bulk', protect, createBulkFlashcards);
router.post('/reset-progress', protect, resetFolderProgress);
router.get('/', protect, getFlashcards);
router.post('/', protect, createFlashcard);
router.get('/:id', protect, getFlashcard);
router.put('/:id', protect, updateFlashcard);
router.delete('/:id', protect, deleteFlashcard);
router.put('/:id/review', protect, updateReviewStatus);

module.exports = router;
