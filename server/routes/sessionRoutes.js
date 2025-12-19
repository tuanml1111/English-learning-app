const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createSession,
  getSessions,
  getStats,
} = require('../controllers/sessionController');

router.get('/stats', protect, getStats);
router.get('/', protect, getSessions);
router.post('/', protect, createSession);

module.exports = router;
