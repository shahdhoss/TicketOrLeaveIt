const EventService = require('../../services/eventService');
const axios = require('axios');
const crypto = require('crypto');

jest.mock('axios');
jest.mock('crypto');

describe('EventService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EVENT_API_KEY = 'event_key_123';
    process.env.EVENT_VENDOR_ID = 'vendor_456';
  });

  describe('createEvent', () => {
    const mockAuthResponse = {
      data: {
        token: 'auth_event_token_123'
      }
    };

    const mockCreateResponse = {
      data: {
        id: 'event_123',
        name: 'Test Event',
        status: 'created'
      }
    };

    beforeEach(() => {
      axios.post
        .mockResolvedValueOnce(mockAuthResponse)
        .mockResolvedValueOnce(mockCreateResponse);
    });

    it('should successfully create an event', async () => {
      const result = await EventService.createEvent({
        name: 'Test Event',
        capacity: 100,
        date: '2025-01-01'
      });

      expect(result).toEqual({
        eventId: 'event_123',
        status: 'created',
        name: 'Test Event'
      });

      expect(axios.post).toHaveBeenCalledTimes(2);
    });

    it('should handle API errors', async () => {
      axios.post.mockRejectedValueOnce(new Error('API Error'));

      await expect(EventService.createEvent({
        name: 'Test Event',
        capacity: 100,
        date: '2025-01-01'
      }))
        .rejects
        .toThrow('Event creation failed');
    });
  });

  describe('verifyWebhook', () => {
    const mockData = {
      obj: {
        event_id: 'event_123',
        name: 'Sample Event',
        created_at: '2024-01-01',
        status: 'active',
        venue: 'Venue A'
      },
      hmac: 'event_hmac_valid'
    };

    it('should verify valid webhook data', () => {
      crypto.createHmac.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('event_hmac_valid')
      });

      const result = EventService.verifyWebhook(mockData, 'webhook_secret');
      expect(result).toBe(true);
    });

    it('should reject invalid webhook data', () => {
      crypto.createHmac.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('invalid_hmac')
      });

      const result = EventService.verifyWebhook(mockData, 'webhook_secret');
      expect(result).toBe(false);
    });

    it('should handle missing event_id', () => {
      const dataWithoutEventId = {
        ...mockData,
        obj: { ...mockData.obj, event_id: null }
      };

      crypto.createHmac.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('event_hmac_valid')
      });

      const result = EventService.verifyWebhook(dataWithoutEventId, 'webhook_secret');
      expect(result).toBe(true);
    });

    it('should handle errors during verification', () => {
      crypto.createHmac.mockImplementation(() => {
        throw new Error('Crypto error');
      });

      const result = EventService.verifyWebhook(mockData, 'webhook_secret');
      expect(result).toBe(false);
    });
  });
});
