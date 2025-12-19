const { User } = require('../models');
const { Op } = require('sequelize');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (userExists) {
      return errorResponse(res, 400, 'User already exists');
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user.id);

    return successResponse(res, 201, 'User registered successfully', {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password');
    }

    // Check for user (Sequelize returns all fields including password by default)
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.id);

    return successResponse(res, 200, 'Logged in successfully', {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'User retrieved successfully', {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email, avatar } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    await user.save();

    return successResponse(res, 200, 'Profile updated successfully', {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};
