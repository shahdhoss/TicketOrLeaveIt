const { createEvent, cancelEvent, checkHealth } = require('../../controllers/eventController');
const EventService = require('../../services/eventService');
const { Event } = require('../events-service/events/models');
const redisClient = require('../events-service/events/redisClient');
const axios = require('axios');

// Mock dependencies
jest.mock('../../services/eventService');
jest.mock('../../models');
jest.mock('../../redisClient');
jest.mock('axios');
jest.mock('../../messaging/sendMessage', () => ({
  notifyVendors: jest.fn(),
  updateEventStatus: jest.fn()
}));

describe('Event Controller', () => {
  let mockReq;
  let mockRes;
  let mockJson;
  let mockStatus;

  beforeEach(() => {
    jest.clearAllMocks();

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRes = {
      json: mockJson,
      status: mockStatus
    };

    mockReq = {
      body: {
        name: 'Concert Night',
        capacity: 300,
        date: '2025-08-01'
      },
      params: {
        id: '1'
      }
    };

    redisClient.get.mockResolvedValue(JSON.stringify({
      vendor_id: 10,
      capacity: 300,
      date: '2025-08-01'
    }));

    axios.get.mockResolvedValue({ status: 200 });
  });

  describe('createEvent', () => {
    it('should successfully create an event', async () => {
      EventService.createEvent.mockResolvedValue({
        eventId: 'event_123',
        name: 'Concert Night',
        status: 'created'
      });

      Event.create.mockResolvedValue({
        id: 1,
        name: 'Concert Night',
        capacity: 300
      });

      await createEvent(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        eventId: 'event_123',
        name: 'Concert Night'
      });
    });

    it('should handle missing vendor info in Redis', async () => {
      redisClient.get.mockResolvedValue(null);

      await createEvent(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Vendor info not found in Redis'
      });
    });

    it('should handle invalid event data', async () => {
      redisClient.get.mockResolvedValue(JSON.stringify({
        vendor_id: null,
        capacity: 0
      }));

      await createEvent(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: expect.any(String)
      });
    });
  });

  describe('cancelEvent', () => {
    it('should successfully cancel an event', async () => {
      Event.findByPk.mockResolvedValue({
        id: 1,
        status: 'active',
        save: jest.fn().mockResolvedValue(true)
      });

      await cancelEvent(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Event ID 1 cancelled successfully'
      });
    });

    it('should handle non-existent event', async () => {
      Event.findByPk.mockResolvedValue(null);

      await cancelEvent(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Event not found'
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
