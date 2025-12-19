const { Op } = require('sequelize');
const { ReadingMaterial } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all reading materials for user
// @route   GET /api/readings
// @access  Private
exports.getReadings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const page = parseInt(req.query.page, 10) || 1;
    const { search, category } = req.query;

    const where = { userId: req.user.id };

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const { count, rows } = await ReadingMaterial.findAndCountAll({
      where,
      attributes: { exclude: ['content'] },
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return successResponse(res, 200, 'Reading materials retrieved successfully', rows);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reading material by ID
// @route   GET /api/readings/:id
// @access  Private
exports.getReading = async (req, res, next) => {
  try {
    const reading = await ReadingMaterial.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!reading) {
      return errorResponse(res, 404, 'Reading material not found');
    }

    return successResponse(res, 200, 'Reading material retrieved successfully', reading);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new reading material
// @route   POST /api/readings
// @access  Private
exports.createReading = async (req, res, next) => {
  try {
    const reading = await ReadingMaterial.create({
      ...req.body,
      userId: req.user.id,
    });

    return successResponse(res, 201, 'Reading material created successfully', reading);
  } catch (error) {
    next(error);
  }
};

// @desc    Update reading material
// @route   PUT /api/readings/:id
// @access  Private
exports.updateReading = async (req, res, next) => {
  try {
    const reading = await ReadingMaterial.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!reading) {
      return errorResponse(res, 404, 'Reading material not found');
    }

    await reading.update(req.body);

    return successResponse(res, 200, 'Reading material updated successfully', reading);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reading material
// @route   DELETE /api/readings/:id
// @access  Private
exports.deleteReading = async (req, res, next) => {
  try {
    const reading = await ReadingMaterial.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!reading) {
      return errorResponse(res, 404, 'Reading material not found');
    }

    await reading.destroy();

    return successResponse(res, 200, 'Reading material deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Search readings
// @route   GET /api/readings/search
// @access  Private
exports.searchReadings = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return errorResponse(res, 400, 'Search query is required');
    }

    const readings = await ReadingMaterial.findAll({
      where: {
        userId: req.user.id,
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { content: { [Op.iLike]: `%${q}%` } },
          { tags: { [Op.contains]: [q] } },
        ],
      },
      order: [['created_at', 'DESC']],
      limit: 20,
    });

    return successResponse(res, 200, 'Search results retrieved successfully', readings);
  } catch (error) {
    next(error);
  }
};
