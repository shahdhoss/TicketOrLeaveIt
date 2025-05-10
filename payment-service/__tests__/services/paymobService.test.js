const PaymobService = require('../../services/paymobService');
const axios = require('axios');
const crypto = require('crypto');

jest.mock('axios');
jest.mock('crypto');

describe('PaymobService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PAYMOB_API_KEY = 'sk_test_123';
    process.env.PAYMOB_INTEGRATION_ID = '123';
    process.env.PAYMOB_IFRAME_ID = '456';
  });

  describe('createPayment', () => {
    const mockAuthResponse = {
      data: {
        token: 'auth_token_123'
      }
    };

    const mockOrderResponse = {
      data: {
        id: 'order_123'
      }
    };

    const mockPaymentKeyResponse = {
      data: {
        token: 'payment_token_123',
        id: 'transaction_123'
      }
    };

    beforeEach(() => {
      axios.post
        .mockResolvedValueOnce(mockAuthResponse)
        .mockResolvedValueOnce(mockOrderResponse)
        .mockResolvedValueOnce(mockPaymentKeyResponse);
    });

    it('should successfully create a payment', async () => {
      const result = await PaymobService.createPayment(100, 1, 1);

      expect(result).toEqual({
        paymentUrl: expect.stringContaining('payment_token_123'),
        orderId: 'order_123',
        testInfo: expect.any(Object)
      });

      expect(axios.post).toHaveBeenCalledTimes(3);
    });

    it('should handle API errors', async () => {
      axios.post.mockRejectedValueOnce(new Error('API Error'));

      await expect(PaymobService.createPayment(100, 1, 1))
        .rejects
        .toThrow('Payment processing failed');
    });

    it('should handle test mode correctly', async () => {
      const result = await PaymobService.createPayment(100, 1, 1);

      expect(result.testInfo).toEqual({
        card: '5123 4500 0000 0008',
        expiry: '12/2030',
        cvv: '123'
      });
    });
  });

  describe('verifyWebhook', () => {
    const mockData = {
      obj: {
        amount_cents: '1000',
        created_at: '2024-01-01',
        currency: 'EGP',
        error_occured: false,
        has_parent_transaction: false,
        id: '123',
        integration_id: '456',
        is_3d_secure: false,
        is_auth: false,
        is_capture: true,
        is_refunded: false,
        is_standalone_payment: true,
        is_voided: false,
        order: { id: '789' },
        owner: 'test',
        pending: false,
        source_data: {
          pan: '1234',
          sub_type: 'card'
        },
        success: true
      },
      hmac: 'test_hmac'
    };

    it('should verify valid webhook data', () => {
      crypto.createHmac.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('test_hmac')
      });

      const result = PaymobService.verifyWebhook(mockData, 'test_key');
      expect(result).toBe(true);
    });

    it('should reject invalid webhook data', () => {
      crypto.createHmac.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('invalid_hmac')
      });

      const result = PaymobService.verifyWebhook(mockData, 'test_key');
      expect(result).toBe(false);
    });

    it('should handle missing order id', () => {
      const dataWithoutOrder = {
        ...mockData,
        obj: {
          ...mockData.obj,
          order: null
        }
      };

      crypto.createHmac.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('test_hmac')
      });

      const result = PaymobService.verifyWebhook(dataWithoutOrder, 'test_key');
      expect(result).toBe(true);
    });

    it('should handle errors during verification', () => {
      crypto.createHmac.mockImplementation(() => {
        throw new Error('Crypto error');
      });

      const result = PaymobService.verifyWebhook(mockData, 'test_key');
      expect(result).toBe(false);
    });
  });
}); 