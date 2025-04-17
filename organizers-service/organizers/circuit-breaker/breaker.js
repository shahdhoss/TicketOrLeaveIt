const CircuitBreaker = require('opossum');

const defaultOptions = {
  timeout: 3000, 
  errorThresholdPercentage: 50, 
  resetTimeout: 10000 
};

function withBreaker(fn, options = {}) {
  const breaker = new CircuitBreaker(fn, { ...defaultOptions, ...options });
  breaker.on('open', () => console.warn(`Circuit for ${fn.name} is OPEN`));
  breaker.on('close', () => console.info(`Circuit for ${fn.name} is CLOSED`));
  breaker.on('halfOpen', () => console.info(`Circuit for ${fn.name} is HALF-OPEN`));
  breaker.on('fallback', () => console.warn(`Fallback triggered for ${fn.name}`));

  return (...args) => breaker.fire(...args);
}

module.exports = withBreaker;
