const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/apiResponse');
const { User } = require('../models');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return errorResponse(res, 401, 'Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, 401, 'Not authorized, token failed');
    }

    // Get user from token (Sequelize - no need to exclude password, toJSON does it)
    req.user = await User.findByPk(decoded.id);

    if (!req.user) {
      return errorResponse(res, 404, 'User not found');
    }

    next();
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized to access this route');
  }
};

module.exports = { protect };
