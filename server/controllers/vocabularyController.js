const { Op, fn, col } = require('sequelize');
const { VocabularyLibrary, UserProgress, Flashcard, Folder } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all vocabulary libraries
// @route   GET /api/vocabulary
// @access  Public
exports.getAllLibraries = async (req, res, next) => {
  try {
    const { category, difficulty, search, sort = '-usageCount' } = req.query;

    const where = { isPublic: true };

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const order = sort.startsWith('-')
      ? [[sort.substring(1), 'DESC']]
      : [[sort, 'ASC']];

    const libraries = await VocabularyLibrary.findAll({
      where,
      order,
    });

    return successResponse(res, 200, 'Vocabulary libraries retrieved successfully', libraries);
  } catch (error) {
    next(error);
  }
};

// @desc    Get vocabulary library by ID with all words
// @route   GET /api/vocabulary/:id
// @access  Public
exports.getLibraryById = async (req, res, next) => {
  try {
    const library = await VocabularyLibrary.findByPk(req.params.id);

    if (!library) {
      return errorResponse(res, 404, 'Vocabulary library not found');
    }

    return successResponse(res, 200, 'Vocabulary library retrieved successfully', library);
  } catch (error) {
    next(error);
  }
};

// @desc    Get vocabulary categories
// @route   GET /api/vocabulary/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await VocabularyLibrary.findAll({
      attributes: [[fn('DISTINCT', col('category')), 'category']],
      order: [['category', 'ASC']],
    });

    const values = categories.map((c) => c.get('category')).filter(Boolean);

    return successResponse(res, 200, 'Categories retrieved successfully', values);
  } catch (error) {
    next(error);
  }
};

// @desc    Start learning a vocabulary library
// @route   POST /api/vocabulary/:id/learn
// @access  Private
exports.startLearning = async (req, res, next) => {
  try {
    const libraryId = req.params.id;

    const library = await VocabularyLibrary.findByPk(libraryId);
    if (!library) {
      return errorResponse(res, 404, 'Vocabulary library not found');
    }

    await library.increment('usageCount');

    let userProgress = await UserProgress.findOne({ where: { userId: req.user.id } });
    if (!userProgress) {
      userProgress = await UserProgress.create({
        userId: req.user.id,
        grammarProgress: [],
        vocabularyProgress: [],
      });
    }

    const vocabularyProgress = Array.isArray(userProgress.vocabularyProgress)
      ? [...userProgress.vocabularyProgress]
      : [];

    const idx = vocabularyProgress.findIndex((p) => p.libraryId === libraryId);
    const now = new Date().toISOString();

    if (idx === -1) {
      vocabularyProgress.push({
        libraryId,
        wordsLearned: 0,
        totalWords: library.wordCount,
        lastStudied: now,
      });
      await userProgress.update({ vocabularyProgress });
    }

    return successResponse(res, 200, 'Started learning library successfully', {
      id: library.id,
      title: library.title,
      wordCount: library.wordCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import words from library to user's flashcards
// @route   POST /api/vocabulary/:id/import
// @access  Private
exports.importToFlashcards = async (req, res, next) => {
  try {
    const libraryId = req.params.id;
    const { wordIndices, folderId } = req.body || {};

    const library = await VocabularyLibrary.findByPk(libraryId);
    if (!library) {
      return errorResponse(res, 404, 'Vocabulary library not found');
    }

    if (folderId) {
      const folder = await Folder.findOne({
        where: { id: folderId, userId: req.user.id },
      });
      if (!folder) {
        return errorResponse(res, 404, 'Folder not found');
      }
    }

    let wordsToImport = library.words || [];
    if (wordIndices && Array.isArray(wordIndices)) {
      wordsToImport = wordIndices.map((idx) => library.words[idx]).filter(Boolean);
    }

    const flashcards = wordsToImport.map((word) => ({
      userId: req.user.id,
      folderId: folderId || null,
      frontContent: word.word,
      backContent: word.meaning,
      pronunciation: word.pronunciation || '',
      partOfSpeech: word.partOfSpeech || '',
      example: word.example || '',
      frontImage: word.imageUrl || '',
      audioUrl: word.audioUrl || '',
      tags: ['vocabulary', (library.category || '').toLowerCase()],
    }));

    const createdFlashcards = await Flashcard.bulkCreate(flashcards, { returning: true });

    if (folderId) {
      await Folder.increment('flashcardCount', { by: createdFlashcards.length, where: { id: folderId } });
    }

    let userProgress = await UserProgress.findOne({ where: { userId: req.user.id } });
    if (!userProgress) {
      userProgress = await UserProgress.create({
        userId: req.user.id,
        grammarProgress: [],
        vocabularyProgress: [],
      });
    }

    const vocabularyProgress = Array.isArray(userProgress.vocabularyProgress)
      ? [...userProgress.vocabularyProgress]
      : [];
    const idx = vocabularyProgress.findIndex((p) => p.libraryId === libraryId);
    const now = new Date().toISOString();

    if (idx !== -1) {
      vocabularyProgress[idx] = {
        ...vocabularyProgress[idx],
        wordsLearned: (vocabularyProgress[idx].wordsLearned || 0) + createdFlashcards.length,
        lastStudied: now,
      };
    } else {
      vocabularyProgress.push({
        libraryId,
        wordsLearned: createdFlashcards.length,
        totalWords: library.wordCount,
        lastStudied: now,
      });
    }

    await userProgress.update({ vocabularyProgress });

    return successResponse(res, 201, 'Words imported to flashcards successfully', {
      imported: createdFlashcards.length,
      flashcards: createdFlashcards.map((fc) => fc.toJSON()),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's vocabulary progress
// @route   GET /api/vocabulary/my-progress
// @access  Private
exports.getUserProgress = async (req, res, next) => {
  try {
    const userProgress = await UserProgress.findOne({
      where: { userId: req.user.id },
    });

    if (!userProgress) {
      return successResponse(res, 200, 'No progress found', []);
    }

    return successResponse(res, 200, 'Progress retrieved successfully', userProgress.vocabularyProgress);
  } catch (error) {
    next(error);
  }
};
