const { Op, fn, col } = require('sequelize');
const { Folder, Flashcard, sequelize } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Helper: build flashcard count map for a user's folders
const getFlashcardCounts = async (userId) => {
  const counts = await Flashcard.findAll({
    where: { userId },
    attributes: ['folderId', [fn('COUNT', col('id')), 'count']],
    group: ['folderId'],
  });

  const map = {};
  counts.forEach((row) => {
    map[row.folderId] = Number(row.get('count'));
  });

  return map;
};

// Helper: build "good" (well-known) flashcard count map for folders
const getGoodFlashcardCounts = async (userId) => {
  const counts = await Flashcard.findAll({
    where: {
      userId,
      confidenceLevel: { [Op.gte]: 5 } // Cards with confidence level 5 (Easy/Good)
    },
    attributes: ['folderId', [fn('COUNT', col('id')), 'count']],
    group: ['folderId'],
  });

  const map = {};
  counts.forEach((row) => {
    map[row.folderId] = Number(row.get('count'));
  });

  return map;
};

// @desc    Get all folders for user (with hierarchy)
// @route   GET /api/folders
// @access  Private
exports.getFolders = async (req, res, next) => {
  try {
    const folders = await Folder.findAll({
      where: { userId: req.user.id },
      order: [['created_at', 'DESC']],
    });

    const [countMap, goodCountMap] = await Promise.all([
      getFlashcardCounts(req.user.id),
      getGoodFlashcardCounts(req.user.id),
    ]);

    const result = folders.map((folder) => ({
      ...folder.toJSON(),
      flashcardCount: countMap[folder.id] || 0,
      goodCount: goodCountMap[folder.id] || 0,
    }));

    return successResponse(res, 200, 'Folders retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get folder by ID with flashcards
// @route   GET /api/folders/:id
// @access  Private
exports.getFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!folder) {
      return errorResponse(res, 404, 'Folder not found');
    }

    const [flashcards, childFolders] = await Promise.all([
      Flashcard.findAll({
        where: { userId: req.user.id, folderId: folder.id },
        order: [['created_at', 'DESC']],
      }),
      Folder.findAll({
        where: { userId: req.user.id, parentFolder: folder.id },
      }),
    ]);

    return successResponse(res, 200, 'Folder retrieved successfully', {
      folder,
      flashcards,
      childFolders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new folder
// @route   POST /api/folders
// @access  Private
exports.createFolder = async (req, res, next) => {
  try {
    const folderData = {
      ...req.body,
      userId: req.user.id,
    };

    if (folderData.parentFolder) {
      const parentExists = await Folder.findOne({
        where: { id: folderData.parentFolder, userId: req.user.id },
      });
      if (!parentExists) {
        return errorResponse(res, 404, 'Parent folder not found');
      }
    }

    const folder = await Folder.create(folderData);

    return successResponse(res, 201, 'Folder created successfully', folder);
  } catch (error) {
    next(error);
  }
};

// @desc    Update folder
// @route   PUT /api/folders/:id
// @access  Private
exports.updateFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!folder) {
      return errorResponse(res, 404, 'Folder not found');
    }

    if (req.body.parentFolder) {
      if (req.body.parentFolder === req.params.id) {
        return errorResponse(res, 400, 'Folder cannot be its own parent');
      }

      const parentExists = await Folder.findOne({
        where: { id: req.body.parentFolder, userId: req.user.id },
      });

      if (!parentExists) {
        return errorResponse(res, 404, 'Parent folder not found');
      }
    }

    await folder.update(req.body);

    return successResponse(res, 200, 'Folder updated successfully', folder);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete folder (and its children)
// @route   DELETE /api/folders/:id
// @access  Private
exports.deleteFolder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const folder = await Folder.findOne({
      where: { id: req.params.id, userId: req.user.id },
      transaction,
    });

    if (!folder) {
      await transaction.rollback();
      return errorResponse(res, 404, 'Folder not found');
    }

    // Unassign flashcards in this folder
    await Flashcard.update(
      { folderId: null },
      { where: { userId: req.user.id, folderId: folder.id }, transaction }
    );

    await folder.destroy({ transaction });
    await transaction.commit();

    return successResponse(res, 200, 'Folder deleted successfully');
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// @desc    Move folder to another parent
// @route   POST /api/folders/:id/move
// @access  Private
exports.moveFolder = async (req, res, next) => {
  try {
    const { parentFolder } = req.body;

    const folder = await Folder.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!folder) {
      return errorResponse(res, 404, 'Folder not found');
    }

    if (parentFolder) {
      if (parentFolder === req.params.id) {
        return errorResponse(res, 400, 'Folder cannot be its own parent');
      }

      const parentExists = await Folder.findOne({
        where: { id: parentFolder, userId: req.user.id },
      });

      if (!parentExists) {
        return errorResponse(res, 404, 'Parent folder not found');
      }
    }

    await folder.update({ parentFolder: parentFolder || null });

    return successResponse(res, 200, 'Folder moved successfully', folder);
  } catch (error) {
    next(error);
  }
};

// @desc    Add flashcard to folder
// @route   POST /api/folders/:id/cards
// @access  Private
exports.addCardToFolder = async (req, res, next) => {
  try {
    const { flashcardId } = req.body;

    const folder = await Folder.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!folder) {
      return errorResponse(res, 404, 'Folder not found');
    }

    const flashcard = await Flashcard.findOne({
      where: { id: flashcardId, userId: req.user.id },
    });

    if (!flashcard) {
      return errorResponse(res, 404, 'Flashcard not found');
    }

    const oldFolderId = flashcard.folderId;
    await flashcard.update({ folderId: folder.id });

    if (oldFolderId && oldFolderId !== folder.id) {
      await Folder.increment('flashcardCount', { by: -1, where: { id: oldFolderId } });
    }
    await Folder.increment('flashcardCount', { by: 1, where: { id: folder.id } });

    return successResponse(res, 200, 'Flashcard added to folder successfully', {
      flashcard,
      folder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove flashcard from folder
// @route   DELETE /api/folders/:id/cards/:cardId
// @access  Private
exports.removeCardFromFolder = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const folder = await Folder.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!folder) {
      return errorResponse(res, 404, 'Folder not found');
    }

    const flashcard = await Flashcard.findOne({
      where: { id: cardId, userId: req.user.id, folderId: folder.id },
    });

    if (!flashcard) {
      return errorResponse(res, 404, 'Flashcard not found in this folder');
    }

    await flashcard.update({ folderId: null });
    await Folder.increment('flashcardCount', { by: -1, where: { id: folder.id } });

    return successResponse(res, 200, 'Flashcard removed from folder successfully', flashcard);
  } catch (error) {
    next(error);
  }
};
