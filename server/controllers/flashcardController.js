const { Op } = require('sequelize');
const { Flashcard, Folder } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all flashcards for user
// @route   GET /api/flashcards
// @access  Private
exports.getFlashcards = async (req, res, next) => {
  try {
    const { folderId, isKnown, search, confidenceLevel } = req.query;

    const where = { userId: req.user.id };

    if (folderId) {
      where.folderId = folderId;
    }

    if (isKnown !== undefined) {
      where.isKnown = isKnown === 'true';
    }

    if (confidenceLevel) {
      // Support filtering by multiple confidence levels (e.g., "0,1,2")
      const levels = confidenceLevel.split(',').map(l => parseInt(l.trim()));
      where.confidenceLevel = { [Op.in]: levels };
    }

    if (search) {
      where[Op.or] = [
        { frontContent: { [Op.iLike]: `%${search}%` } },
        { backContent: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const flashcards = await Flashcard.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    return successResponse(res, 200, 'Flashcards retrieved successfully', flashcards);
  } catch (error) {
    next(error);
  }
};

// @desc    Get flashcard by ID
// @route   GET /api/flashcards/:id
// @access  Private
exports.getFlashcard = async (req, res, next) => {
  try {
    const flashcard = await Flashcard.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!flashcard) {
      return errorResponse(res, 404, 'Flashcard not found');
    }

    return successResponse(res, 200, 'Flashcard retrieved successfully', flashcard);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new flashcard
// @route   POST /api/flashcards
// @access  Private
exports.createFlashcard = async (req, res, next) => {
  try {
    const { folderId, ...payload } = req.body;

    if (folderId) {
      const folder = await Folder.findOne({
        where: { id: folderId, userId: req.user.id },
      });
      if (!folder) {
        return errorResponse(res, 404, 'Folder not found');
      }
    }

    const flashcard = await Flashcard.create({
      ...payload,
      folderId: folderId || null,
      userId: req.user.id,
    });

    if (folderId) {
      await Folder.increment('flashcardCount', { by: 1, where: { id: folderId } });
    }

    return successResponse(res, 201, 'Flashcard created successfully', flashcard);
  } catch (error) {
    next(error);
  }
};

// @desc    Update flashcard
// @route   PUT /api/flashcards/:id
// @access  Private
exports.updateFlashcard = async (req, res, next) => {
  try {
    const flashcard = await Flashcard.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!flashcard) {
      return errorResponse(res, 404, 'Flashcard not found');
    }

    const oldFolderId = flashcard.folderId;
    const newFolderId = req.body.folderId;

    if (newFolderId) {
      const folder = await Folder.findOne({
        where: { id: newFolderId, userId: req.user.id },
      });
      if (!folder) {
        return errorResponse(res, 404, 'Folder not found');
      }
    }

    await flashcard.update(req.body);

    if (oldFolderId !== newFolderId) {
      if (oldFolderId) {
        await Folder.increment('flashcardCount', { by: -1, where: { id: oldFolderId } });
      }
      if (newFolderId) {
        await Folder.increment('flashcardCount', { by: 1, where: { id: newFolderId } });
      }
    }

    return successResponse(res, 200, 'Flashcard updated successfully', flashcard);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete flashcard
// @route   DELETE /api/flashcards/:id
// @access  Private
exports.deleteFlashcard = async (req, res, next) => {
  try {
    const flashcard = await Flashcard.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!flashcard) {
      return errorResponse(res, 404, 'Flashcard not found');
    }

    if (flashcard.folderId) {
      await Folder.increment('flashcardCount', { by: -1, where: { id: flashcard.folderId } });
    }

    await flashcard.destroy();

    return successResponse(res, 200, 'Flashcard deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update flashcard review status
// @route   PUT /api/flashcards/:id/review
// @access  Private
exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { isKnown, confidenceLevel } = req.body;

    const flashcard = await Flashcard.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!flashcard) {
      return errorResponse(res, 404, 'Flashcard not found');
    }

    const updatedConfidence = confidenceLevel !== undefined ? confidenceLevel : flashcard.confidenceLevel;
    const updatedIsKnown = isKnown !== undefined ? isKnown : flashcard.isKnown;

    let nextReviewDate;
    if (updatedIsKnown) {
      const daysToAdd = Math.min(updatedConfidence * 2 + 1, 30);
      nextReviewDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
    } else {
      nextReviewDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    await flashcard.update({
      reviewCount: (flashcard.reviewCount || 0) + 1,
      lastReviewed: new Date(),
      isKnown: updatedIsKnown,
      confidenceLevel: updatedConfidence,
      nextReview: nextReviewDate,
    });

    return successResponse(res, 200, 'Review status updated successfully', flashcard);
  } catch (error) {
    next(error);
  }
};

// @desc    Get flashcards due for review
// @route   GET /api/flashcards/due
// @access  Private
exports.getDueFlashcards = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.findAll({
      where: {
        userId: req.user.id,
        isKnown: false,
        [Op.or]: [
          { nextReview: { [Op.lte]: new Date() } },
          { nextReview: null },
        ],
      },
      order: [['nextReview', 'ASC']],
      limit: 50,
    });

    return successResponse(res, 200, 'Due flashcards retrieved successfully', flashcards);
  } catch (error) {
    next(error);
  }
};

// @desc    Create multiple flashcards (bulk)
// @route   POST /api/flashcards/bulk
// @access  Private
exports.createBulkFlashcards = async (req, res, next) => {
  try {
    const { flashcards } = req.body;

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      return errorResponse(res, 400, 'Please provide an array of flashcards');
    }

    const flashcardsWithUser = flashcards.map((fc) => ({
      ...fc,
      userId: req.user.id,
    }));

    const createdFlashcards = await Flashcard.bulkCreate(flashcardsWithUser, { returning: true });

    const folderCounts = {};
    createdFlashcards.forEach((fc) => {
      if (fc.folderId) {
        folderCounts[fc.folderId] = (folderCounts[fc.folderId] || 0) + 1;
      }
    });

    for (const [folderId, count] of Object.entries(folderCounts)) {
      await Folder.increment('flashcardCount', { by: count, where: { id: folderId } });
    }

    return successResponse(res, 201, 'Flashcards created successfully', {
      flashcards: createdFlashcards.map((fc) => fc.toJSON()),
      count: createdFlashcards.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset progress for all flashcards in a folder
// @route   POST /api/flashcards/reset-progress
// @access  Private
exports.resetFolderProgress = async (req, res, next) => {
  try {
    const { folderId } = req.body;

    if (!folderId) {
      return errorResponse(res, 400, 'Folder ID is required');
    }

    // Verify folder belongs to user
    const folder = await Folder.findOne({
      where: { id: folderId, userId: req.user.id },
    });

    if (!folder) {
      return errorResponse(res, 404, 'Folder not found');
    }

    // Reset all flashcards in the folder
    const result = await Flashcard.update(
      {
        confidenceLevel: 0,
        reviewCount: 0,
        isKnown: false,
        lastReviewed: null,
        nextReview: null,
      },
      {
        where: {
          userId: req.user.id,
          folderId: folderId,
        },
      }
    );

    return successResponse(res, 200, 'Folder progress reset successfully', {
      updatedCount: result[0],
    });
  } catch (error) {
    next(error);
  }
};
