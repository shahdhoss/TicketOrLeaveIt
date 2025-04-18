const { verifyToken } = require('../utils/jwt');

const verifyRefreshToken = (req, res, next) => {
  const token = req.cookies.refresh_token;

  if (!token) return res.status(401).json({ detail: 'Missing refresh token' });

  const payload = verifyToken(token);
  if (!payload) return res.status(403).json({ detail: 'Invalid or expired token' });

  req.user = payload;
  next();
};

module.exports = verifyRefreshToken;
