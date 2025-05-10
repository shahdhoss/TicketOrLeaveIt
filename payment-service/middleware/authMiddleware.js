const logger = require('../utils/logger');

function extractUserFromToken(req, res, next) {
  try {
    // Get user info from API Gateway context
    const userInfo = req.headers['x-user-info'];
    if (!userInfo) {
      logger.warn('No user info found in request headers');
      return res.status(401).json({ error: 'Unauthorized - No user info' });
    }

    try {
      // Parse user info from header
      const user = JSON.parse(userInfo);
      req.user = user;
      next();
    } catch (error) {
      logger.error('Failed to parse user info:', error);
      return res.status(401).json({ error: 'Unauthorized - Invalid user info' });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  extractUserFromToken
}; 