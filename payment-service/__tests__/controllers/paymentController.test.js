const { initiatePayment, refundPayment, checkHealth } = require('../../controllers/paymentController');
const PaymobService = require('../../services/paymobService');
const { Payment } = require('../../models');
const redisClient = require('../../redisClient');
const axios = require('axios');

// Mock dependencies
jest.mock('../../services/paymobService');
jest.mock('../../models');
jest.mock('../../redisClient');
jest.mock('axios');
jest.mock('../../messaging/sendMessage', () => ({
  updateTicketReservation: jest.fn(),
  updateEventCapacityandReservationStatus: jest.fn()
}));

describe('Payment Controller', () => {
  let mockReq;
  let mockRes;
  let mockJson;
  let mockStatus;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock response
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRes = {
      json: mockJson,
      status: mockStatus
    };

    // Setup mock request
    mockReq = {
      body: {
        ticketId: '123',
        amount: 100
      },
      params: {
        id: '1'
      }
    };

    // Mock Redis response
    redisClient.get.mockResolvedValue(JSON.stringify({
      event_id: 1,
      user_id: 1,
      reservation_id: '123',
      amount: 100
    }));

    // Mock health checks
    axios.get.mockResolvedValue({ status: 200 });
  });

  describe('initiatePayment', () => {
    it('should successfully initiate a payment', async () => {
      // Mock PaymobService response
      PaymobService.createPayment.mockResolvedValue({
        paymentUrl: 'https://test.payment.url',
        orderId: '123'
      });

      // Mock Payment.create
      Payment.create.mockResolvedValue({
        id: 1,
        userId: 1,
        eventId: 1,
        amount: 100
      });

      await initiatePayment(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        paymentUrl: 'https://test.payment.url',
        orderId: '123'
      });
    });

    it('should handle missing reservation in Redis', async () => {
      redisClient.get.mockResolvedValue(null);

      await initiatePayment(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Reservation not found in Redis'
      });
    });

    it('should handle invalid request data', async () => {
      redisClient.get.mockResolvedValue(JSON.stringify({
        event_id: null,
        user_id: null,
        amount: 0
      }));

      await initiatePayment(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: expect.any(String)
      });
    });
  });

  describe('refundPayment', () => {
    it('should successfully refund a payment', async () => {
      Payment.findByPk.mockResolvedValue({
        id: 1,
        isVerified: 'pending',
        save: jest.fn().mockResolvedValue(true)
      });

      await refundPayment(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Payment ID 1 refunded successfully'
      });
    });

    it('should handle non-existent payment', async () => {
      Payment.findByPk.mockResolvedValue(null);

      await refundPayment(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Payment not found'
      });
    });
  });

  describe('checkHealth', () => {
    it('should return ok status', async () => {
      await checkHealth(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ status: 'ok' });
    });
  });
}); 