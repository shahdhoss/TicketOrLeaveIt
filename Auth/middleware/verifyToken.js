const { verifyToken } = require('../utils/jwt');

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ detail: 'Missing access token' });

  const payload = verifyToken(token);
  if (!payload) return res.status(403).json({ detail: 'Invalid or expired access token' });

  req.user = payload;
  next();
};

module.exports = verifyAccessToken;
