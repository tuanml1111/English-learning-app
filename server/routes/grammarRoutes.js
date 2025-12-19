const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllTopics,
  getTopicById,
  getCategories,
  updateProgress,
  getUserProgress,
} = require('../controllers/grammarController');

router.get('/categories', getCategories);
router.get('/my-progress', protect, getUserProgress);
router.get('/', getAllTopics);
router.get('/:id', getTopicById);
router.post('/:id/progress', protect, updateProgress);

module.exports = router;
