const db = require('../models');

const ticketsPOST = async ({ newTicket }) => {
  const { userId, eventId, seatNumber } = newTicket;

  
  const user = await db.User.findByPk(userId);
  if (!user) {
    throw { code: 404, error: 'User not found' };
  }

  
  const event = await db.Event.findByPk(eventId);
  if (!event) {
    throw { code: 404, error: 'Event not found' };
  }

 

  const ticket = await db.Ticket.create({ userId, eventId, seatNumber });
  return { code: 201, payload: ticket };
};

const ticketsIdGET = async ({ ticketId }) => {
  const ticket = await db.Ticket.findByPk(ticketId);
  if (!ticket) {
    throw { code: 404, error: 'Ticket not found' };
  }
  return ticket;
};

const ticketsIdDELETE = async ({ ticketId }) => {
  const ticket = await db.Ticket.findByPk(ticketId);
  if (!ticket) {
    throw { code: 404, error: 'Ticket not found' };
  }

  await ticket.destroy(); 
  return { message: 'Ticket cancelled successfully' };
};

const usersUserIdTicketsGET = async ({ userId }) => {
  const tickets = await db.Ticket.findAll({ where: { userId } });
  return tickets;
};

module.exports = {
  ticketsPOST,
  ticketsIdGET,
  ticketsIdDELETE,
  usersUserIdTicketsGET,
};
