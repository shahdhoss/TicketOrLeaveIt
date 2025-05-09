const client = require('prom-client');

// Create Registry
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom Metrics
const paymentMetrics = {
  requests: new client.Counter({
    name: 'payment_requests_total',
    help: 'Total payment requests',
    labelNames: ['method', 'status'],
  }),
  amounts: new client.Histogram({
    name: 'payment_amounts',
    help: 'Payment amount distribution',
    buckets: [10, 50, 100, 500, 1000],
  }),
  duration: new client.Histogram({
    name: 'payment_process_duration_seconds',
    help: 'Payment processing time',
    buckets: [0.1, 0.3, 0.5, 1, 2],
  }),
  refunds: new client.Counter({
    name: 'payment_refunds_total',
    help: 'Total payment refunds',
    labelNames: ['status'],
  }),
  refundDuration: new client.Histogram({
    name: 'payment_refund_duration_seconds',
    help: 'Payment refund processing time',
    buckets: [0.1, 0.3, 0.5, 1, 2],
  }),
};

// Register all metrics
Object.values(paymentMetrics).forEach(metric => register.registerMetric(metric));

module.exports = { register, paymentMetrics };