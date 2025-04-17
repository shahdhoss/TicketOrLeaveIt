require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

class PaymobService {
  static async createPayment(amount, userId, eventId) {
    const debugLog = [];
    const isTestMode = process.env.PAYMOB_API_KEY.startsWith('sk_test_');

    try {
      debugLog.push('\n=== PAYMOB FLOW STARTED ===');
      debugLog.push(`Input: ${amount} EGP | User: ${userId} | Event: ${eventId}`);

      const authRes = await axios.post(
        'https://accept.paymob.com/api/auth/tokens',
        { api_key: process.env.PAYMOB_API_KEY },
        { timeout: 10000 }
      );

      const orderRes = await axios.post(
        'https://accept.paymob.com/api/ecommerce/orders',
        {
          auth_token: authRes.data.token,
          amount_cents: Math.round(amount * 100),
          currency: 'EGP',
          items: [],
          merchant_order_id: `user-${userId}-event-${eventId}`
        }
      );

      const paymentKeyPayload = {
        auth_token: authRes.data.token,
        amount_cents: Math.round(amount * 100),
        order_id: orderRes.data.id,
        currency: "EGP",
        integration_id: parseInt(process.env.PAYMOB_INTEGRATION_ID),
        billing_data: {
          first_name: "NA",
          last_name: "NA",
          email: "NA",
          phone_number: "NA",
          city: "NA",
          country: "NA",
          street: "NA",
          building: "NA",
          floor: "NA",
          apartment: "NA"
        },
        bypass_3ds: true,
        payment_methods: ['card'],
        card_payment: {
          bypass_3ds: true,
          force_accept: true,
          override_result: 'success' 
        },
        processing_settings: {
          override_3ds: true,
          force_approval: true,
          skip_fraud_check: true,
          force_settlement: true 
        },
        ...(isTestMode && {
          test_mode: true,
          test_force_accept: true,
          force_processing: true
        })
      };

      const paymentRes = await axios.post(
        'https://accept.paymob.com/api/acceptance/payment_keys',
        paymentKeyPayload
      );

      if (isTestMode) {
        await axios.post(
          'https://accept.paymob.com/api/acceptance/test_override',
          {
            auth_token: authRes.data.token,
            transaction_id: paymentRes.data.id,
            action: 'capture',
            override_all: true           }
        );
      }

      return {
        paymentUrl: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentRes.data.token}`,
        orderId: orderRes.data.id,
        testInfo: isTestMode ? {
          card: '5123 4500 0000 0008', 
          expiry: '12/2030',
          cvv: '123'
        } : null
      };

    } catch (error) {
      console.error('PAYMOB ERROR:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config?.data
      });
      throw new Error('Payment processing failed');
    }
  }

  static verifyWebhook(data, hmackey) {
    try {
      const obj = data.obj;
      const hmacString = [
        obj.amount_cents,
        obj.created_at,
        obj.currency,
        obj.error_occured,
        obj.has_parent_transaction,
        obj.id,
        obj.integration_id,
        obj.is_3d_secure,
        obj.is_auth,
        obj.is_capture,
        obj.is_refunded,
        obj.is_standalone_payment,
        obj.is_voided,
        obj.order?.id || '',
        obj.owner,
        obj.pending,
        obj.source_data?.pan || '',
        obj.source_data?.sub_type || '',
        obj.success
      ].join('');

      return crypto.createHmac('sha512', hmackey)
        .update(hmacString)
        .digest('hex') === data.hmac;
    } catch (e) {
      console.error('HMAC Verification Error:', e);
      return false;
    }
  }
}

module.exports = PaymobService;