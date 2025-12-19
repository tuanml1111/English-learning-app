const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getReadings,
  getReading,
  createReading,
  updateReading,
  deleteReading,
  searchReadings,
} = require('../controllers/readingController');

router.get('/search', protect, searchReadings);
router.get('/', protect, getReadings);
router.post('/', protect, createReading);
router.get('/:id', protect, getReading);
router.put('/:id', protect, updateReading);
router.delete('/:id', protect, deleteReading);

module.exports = router;
