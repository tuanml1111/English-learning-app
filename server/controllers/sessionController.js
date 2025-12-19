const { Op } = require('sequelize');
const { StudySession, Folder } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Create study session
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res, next) => {
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

    const session = await StudySession.create({
      ...payload,
      folderId: folderId || null,
      userId: req.user.id,
    });

    return successResponse(res, 201, 'Study session created successfully', session);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's study sessions
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const page = parseInt(req.query.page, 10) || 1;

    const { count, rows } = await StudySession.findAndCountAll({
      where: { userId: req.user.id },
      order: [['completed_at', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return successResponse(res, 200, 'Study sessions retrieved successfully', {
      sessions: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get study statistics
// @route   GET /api/sessions/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const { period = 'week' } = req.query; // week, month, year, all

    let completedAtFilter = null;
    const now = new Date();

    switch (period) {
      case 'week':
        completedAtFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        completedAtFilter = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        completedAtFilter = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        completedAtFilter = null;
    }

    const where = { userId: req.user.id };
    if (completedAtFilter) {
      where.completedAt = { [Op.gte]: completedAtFilter };
    }

    const sessions = await StudySession.findAll({ where });

    const totalSessions = sessions.length;
    const totalCardsStudied = sessions.reduce((sum, s) => sum + (s.cardsStudied || 0), 0);
    const totalCorrectAnswers = sessions.reduce((sum, s) => sum + (s.correctAnswers || 0), 0);
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    const accuracy =
      totalCardsStudied > 0 ? ((totalCorrectAnswers / totalCardsStudied) * 100).toFixed(2) : 0;
    const averageSessionDuration =
      totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

    const stats = {
      totalSessions,
      totalCardsStudied,
      totalCorrectAnswers,
      totalDuration,
      averageAccuracy: accuracy,
      averageSessionDuration,
    };

    return successResponse(res, 200, 'Statistics retrieved successfully', {
      stats,
      period,
    });
  } catch (error) {
    next(error);
  }
};
