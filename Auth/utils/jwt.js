const jwt = require('jsonwebtoken');

exports.createAccessToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET_KEY, {
    algorithm: process.env.JWT_Algorithm,
    expiresIn: '15m'
  });
};

exports.createRefreshToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET_KEY, {
    algorithm: process.env.JWT_Algorithm,
    expiresIn: '30d'
  });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    return null;
  }
};
