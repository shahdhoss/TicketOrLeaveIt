const EventService = require('../../services/eventService');
const { Event, Reservation } = require('../../models');
const { Client } = require('@elastic/elasticsearch');
const grpcClient = require('../../grpcClient');
const axios = require('axios');

jest.mock('../../models');
jest.mock('@elastic/elasticsearch');
jest.mock('../../grpcClient');
jest.mock('axios');

describe('EventService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      Event.create.mockResolvedValue({ id: 1 });

      const event = await EventService.createEvent({ title: 'Concert' });

      expect(event).toEqual({ id: 1 });
    });
  });

  describe('getEventById', () => {
    it('should get event by ID', async () => {
      Event.findByPk.mockResolvedValue({ id: 1 });

      const event = await EventService.getEventById(1);

      expect(event).toEqual({ id: 1 });
    });
  });

  describe('updateEvent', () => {
    it('should update event successfully', async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      Event.findByPk.mockResolvedValue({ id: 1, save: mockSave });

      const updated = await EventService.updateEvent(1, { title: 'Updated' });

      expect(updated.id).toBe(1);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      Event.destroy.mockResolvedValue(1);

      const result = await EventService.deleteEvent(1);

      expect(result).toBe(true);
    });
  });

  describe('createReservation', () => {
    it('should create a reservation', async () => {
      Reservation.create.mockResolvedValue({ id: 'resv1' });

      const resv = await EventService.createReservation(1, 1);

      expect(resv.id).toBe('resv1');
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation', async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      Reservation.findByPk.mockResolvedValue({ status: 'active', save: mockSave });

      const result = await EventService.cancelReservation('resv1');

      expect(result).toBe(true);
    });
  });

  describe('searchEvents', () => {
    it('should return search results from Elastic', async () => {
      const mockClient = {
        search: jest.fn().mockResolvedValue({
          hits: { hits: [{ _source: { id: 1, title: 'Test' } }] }
        })
      };
      Client.mockImplementation(() => mockClient);

      const result = await EventService.searchEvents('Test');

      expect(result).toEqual([{ id: 1, title: 'Test' }]);
    });
  });
});
