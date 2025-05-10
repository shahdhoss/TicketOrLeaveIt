const {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  createReservation,
  cancelReservation,
  searchEvents,
  checkHealth
} = require('../../controllers/eventController');

const EventService = require('../../services/eventService');
const redisClient = require('../../redisClient');
const axios = require('axios');

jest.mock('../../services/eventService');
jest.mock('../../redisClient');
jest.mock('axios');
jest.mock('../../messaging/sendMessage', () => ({
  notifyReservationCreation: jest.fn(),
  notifyReservationCancellation: jest.fn()
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
    mockRes = { json: mockJson, status: mockStatus };

    mockReq = {
      body: {
        title: 'Test Event',
        date: '2025-06-01',
        location: 'Cairo',
        capacity: 100
      },
      params: { id: '1' },
      query: { q: 'Cairo' }
    };
  });

  describe('createEvent', () => {
    it('should create an event', async () => {
      EventService.createEvent.mockResolvedValue({ id: 1 });

      await createEvent(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({ success: true, event: { id: 1 } });
    });

    it('should handle creation errors', async () => {
      EventService.createEvent.mockRejectedValue(new Error('Create failed'));

      await createEvent(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Create failed'
      });
    });
  });

  describe('getEventById', () => {
    it('should return the event', async () => {
      EventService.getEventById.mockResolvedValue({ id: 1 });

      await getEventById(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({ success: true, event: { id: 1 } });
    });

    it('should handle event not found', async () => {
      EventService.getEventById.mockResolvedValue(null);

      await getEventById(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Event not found'
      });
    });
  });

  describe('updateEvent', () => {
    it('should update the event', async () => {
      EventService.updateEvent.mockResolvedValue({ id: 1, title: 'Updated' });

      await updateEvent(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({ success: true, event: { id: 1, title: 'Updated' } });
    });
  });

  describe('deleteEvent', () => {
    it('should delete the event', async () => {
      EventService.deleteEvent.mockResolvedValue(true);

      await deleteEvent(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('createReservation', () => {
    it('should create a reservation', async () => {
      EventService.createReservation.mockResolvedValue({ reservationId: 'abc' });

      await createReservation(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({ success: true, reservationId: 'abc' });
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation', async () => {
      EventService.cancelReservation.mockResolvedValue(true);

      await cancelReservation(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('searchEvents', () => {
    it('should return search results', async () => {
      EventService.searchEvents.mockResolvedValue([{ id: 1 }]);

      await searchEvents(mockReq, mockRes);

      expect(mockJson).toHaveBeenCalledWith({ success: true, events: [{ id: 1 }] });
    });
  });

  describe('checkHealth', () => {
    it('should return ok status', async () => {
      axios.get.mockResolvedValue({ status: 200 });

      await checkHealth(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ status: 'ok' });
    });
  });
});
