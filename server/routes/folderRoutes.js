const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  moveFolder,
  addCardToFolder,
  removeCardFromFolder,
} = require('../controllers/folderController');

router.get('/', protect, getFolders);
router.post('/', protect, createFolder);
router.get('/:id', protect, getFolder);
router.put('/:id', protect, updateFolder);
router.delete('/:id', protect, deleteFolder);
router.post('/:id/move', protect, moveFolder);
router.post('/:id/cards', protect, addCardToFolder);
router.delete('/:id/cards/:cardId', protect, removeCardFromFolder);

module.exports = router;
