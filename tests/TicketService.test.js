const TicketService = require('../../services/ticketService');
const axios = require('axios');
const crypto = require('crypto');

jest.mock('axios');
jest.mock('crypto');

describe('TicketService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TICKET_API_KEY = 'api_key_test_123';
    process.env.TICKET_VENDOR_ID = 'vendor_001';
  });

  describe('createTicket', () => {
    const mockReserveResponse = {
      data: {
        reservationId: 'res_123',
        status: 'reserved'
      }
    };

    const mockConfirmResponse = {
      data: {
        ticketId: 'ticket_123',
        status: 'confirmed'
      }
    };

    beforeEach(() => {
      axios.post
        .mockResolvedValueOnce(mockReserveResponse)
        .mockResolvedValueOnce(mockConfirmResponse);
    });

    it('should successfully create a ticket', async () => {
      const result = await TicketService.createTicket(1, 1, 'event_abc');

      expect(result).toEqual({
        ticketId: 'ticket_123',
        reservationId: 'res_123',
        status: 'confirmed'
      });

      expect(axios.post).toHaveBeenCalledTimes(2);
    });

    it('should handle API errors during reservation', async () => {
      axios.post.mockRejectedValueOnce(new Error('Reservation failed'));

      await expect(TicketService.createTicket(1, 1, 'event_abc'))
        .rejects
        .toThrow('Ticket reservation failed');
    });

    it('should handle test mode correctly', async () => {
      const result = await TicketService.createTicket(1, 1, 'event_abc');

      expect(result.status).toBe('confirmed');
      expect(result).toHaveProperty('reservationId');
    });
  });

  describe('verifyTicketWebhook', () => {
    const mockData = {
      obj: {
        ticket_id: 'ticket_123',
        event_id: 'event_abc',
        user_id: 1,
        status: 'issued',
        issued_at: '2024-01-01T12:00:00Z'
      },
      hmac: 'valid_hmac'
    };

    it('should verify valid webhook data', () => {
      crypto.createHmac.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('valid_hmac')
      });

      const result = TicketService.verifyTicketWebhook(mockData, 'secret_key');
      expect(result).toBe(true);
    });

    it('should reject invalid webhook data', () => {
      crypto.createHmac.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('wrong_hmac')
      });

      const result = TicketService.verifyTicketWebhook(mockData, 'secret_key');
      expect(result).toBe(false);
    });

    it('should handle missing ticket_id', () => {
      const dataWithoutTicket = {
        ...mockData,
        obj: { ...mockData.obj, ticket_id: null }
      };

      crypto.createHmac.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('valid_hmac')
      });

      const result = TicketService.verifyTicketWebhook(dataWithoutTicket, 'secret_key');
      expect(result).toBe(true);
    });

    it('should handle errors during verification', () => {
      crypto.createHmac.mockImplementation(() => {
        throw new Error('Crypto error');
      });

      const result = TicketService.verifyTicketWebhook(mockData, 'secret_key');
      expect(result).toBe(false);
    });
  });
});
