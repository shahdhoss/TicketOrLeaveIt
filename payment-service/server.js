require('dotenv').config();
const recieveReservationRequestFromTickets = require('./messaging/recieveMessage');

console.log('\n=== ENVIRONMENT DEBUG ===');
console.log('Current Directory:', process.cwd());
console.log('Environment Variables:', {
  apiKey: process.env.PAYMOB_API_KEY ? '✅ Loaded' : '❌ MISSING',
  integrationId: process.env.PAYMOB_INTEGRATION_ID ? '✅' : '❌',
  iframeId: process.env.PAYMOB_IFRAME_ID ? '✅' : '❌',
  nodeEnv: process.env.NODE_ENV || 'development'
});
console.log('=======================\n');

const app = require('./app');
const PORT = process.env.PORT || 8081;
recieveReservationRequestFromTickets()

app.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}`);
  console.log('Debug Mode: ON - All logs active\n');
});