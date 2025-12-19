const { Op, fn, col } = require('sequelize');
const { GrammarTopic, UserProgress } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all grammar topics
// @route   GET /api/grammar
// @access  Public
exports.getAllTopics = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;

    const where = {};

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

    const topics = await GrammarTopic.findAll({
      where,
      attributes: { exclude: ['content', 'examples', 'exercises'] },
      order: [['category', 'ASC'], ['difficulty', 'ASC']],
    });

    return successResponse(res, 200, 'Grammar topics retrieved successfully', topics);
  } catch (error) {
    next(error);
  }
};

// @desc    Get grammar topic by ID
// @route   GET /api/grammar/:id
// @access  Public
exports.getTopicById = async (req, res, next) => {
  try {
    const topic = await GrammarTopic.findByPk(req.params.id);

    if (!topic) {
      return errorResponse(res, 404, 'Grammar topic not found');
    }

    await topic.increment('viewCount');

    return successResponse(res, 200, 'Grammar topic retrieved successfully', topic);
  } catch (error) {
    next(error);
  }
};

// @desc    Get grammar categories
// @route   GET /api/grammar/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await GrammarTopic.findAll({
      attributes: [[fn('DISTINCT', col('category')), 'category']],
      order: [['category', 'ASC']],
    });

    const values = categories.map((c) => c.get('category')).filter(Boolean);

    return successResponse(res, 200, 'Categories retrieved successfully', values);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user's grammar progress
// @route   POST /api/grammar/:id/progress
// @access  Private
exports.updateProgress = async (req, res, next) => {
  try {
    const { completed, score } = req.body;
    const topicId = req.params.id;

    const topic = await GrammarTopic.findByPk(topicId);
    if (!topic) {
      return errorResponse(res, 404, 'Grammar topic not found');
    }

    let userProgress = await UserProgress.findOne({ where: { userId: req.user.id } });

    if (!userProgress) {
      userProgress = await UserProgress.create({
        userId: req.user.id,
        grammarProgress: [],
        vocabularyProgress: [],
      });
    }

    const grammarProgress = Array.isArray(userProgress.grammarProgress)
      ? [...userProgress.grammarProgress]
      : [];

    const idx = grammarProgress.findIndex((p) => p.topicId === topicId);
    const now = new Date().toISOString();

    if (idx !== -1) {
      grammarProgress[idx] = {
        ...grammarProgress[idx],
        completed: completed !== undefined ? completed : grammarProgress[idx].completed,
        score: score !== undefined ? score : grammarProgress[idx].score,
        lastStudied: now,
      };
    } else {
      grammarProgress.push({
        topicId,
        completed: !!completed,
        score: score || 0,
        lastStudied: now,
      });
    }

    await userProgress.update({ grammarProgress });

    return successResponse(res, 200, 'Progress updated successfully', grammarProgress);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's grammar progress
// @route   GET /api/grammar/my-progress
// @access  Private
exports.getUserProgress = async (req, res, next) => {
  try {
    const userProgress = await UserProgress.findOne({
      where: { userId: req.user.id },
    });

    if (!userProgress) {
      return successResponse(res, 200, 'No progress found', []);
    }

    return successResponse(res, 200, 'Progress retrieved successfully', userProgress.grammarProgress);
  } catch (error) {
    next(error);
  }
};
