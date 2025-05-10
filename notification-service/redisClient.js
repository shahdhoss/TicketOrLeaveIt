const redis = require('redis');

const redisclient = redis.createClient({
  url: 'redis://localhost:6379'
});

redisclient.connect();

redisclient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisclient;
