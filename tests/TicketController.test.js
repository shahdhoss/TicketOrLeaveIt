const { createTicket, getTicketById, checkHealth } = require('../../controllers/ticketController');
const TicketService = require('../../services/ticketService');
const redisClient = require('../ticket-service/ticket/redisClient');
const axios = require('axios');
// Mock dependencies
jest.mock('../../services/TicketService');
jest.mock('../../models');
jest.mock('../../redisClient');
jest.mock('axios');
jest.mock('../../messaging/sendMessage', () => ({
  notifyPaymentService: jest.fn(),
  reserveTicket: jest.fn(),
  cancelTicketReservation: jest.fn(),
}));



describe('Ticket Controller', () => {
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
        eventId: 'event123',
        userId: 'user456',
        seatNumber: 'A1'
      },
      params: {
        id: 'ticket789'
      }
    };
    // Mock Redis response
    redisClient.get.mockResolvedValue(JSON.stringify({
      event_id: 1,
      user_id: 1,
      reservation_id: '123',
      ticket_type: 'VIP',
      quantity: 2
    }));
    // Mock health checks
    axios.get.mockResolvedValue({ status: 200 });
  });
  


  describe('createTicket', () => {
    it('should successfully create a ticket', async () => {
      const mockTicket = {
        id: 'ticket789',
        eventId: 'event123',
        userId: 'user456',
        seatNumber: 'A1'
      };

      TicketService.createTicket.mockResolvedValue(mockTicket);

      await createTicket(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        ticketUrl: 'https://test.ticket.url',
        ticket: mockTicket
      });
    });

it('should handle missing reservation in Redis', async () => {
  // Simulate Redis returning null
  redisClient.get.mockResolvedValue(null);

  await createTicket(mockReq, mockRes);

  expect(mockStatus).toHaveBeenCalledWith(500);
  expect(mockJson).toHaveBeenCalledWith({
    success: false,
    error: 'Reservation not found in Redis'
  });
});
    it('should handle ticket creation failure', async () => {
      TicketService.createTicket.mockRejectedValue(new Error('Ticket creation failed'));

      await createTicket(mockReq, mockRes);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Ticket creation failed'
      });
    });

});

  describe('getTicketById', () => {
    it('should retrieve a ticket by ID', async () => {
      const mockTicket = {
        id: 'ticket789',
        eventId: 'event123',
        userId: 'user456',
        seatNumber: 'A1'
      };

      TicketService.getTicketById.mockResolvedValue(mockTicket);

      await getTicketById(mockReq, mockRes);


      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        ticket: mockTicket
      });
    });

    it('should handle ticket not found', async () => {
      TicketService.getTicketById.mockResolvedValue(null);

      await getTicketById(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Ticket not found'
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
