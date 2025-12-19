const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllLibraries,
  getLibraryById,
  getCategories,
  importToFlashcards,
} = require('../controllers/vocabularyController');

router.get('/categories', getCategories);
router.get('/', getAllLibraries);
router.get('/:id', getLibraryById);
router.post('/:id/import', protect, importToFlashcards);

module.exports = router;
