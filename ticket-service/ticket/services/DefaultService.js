const Service = require('./Service');
const { ticket } = require("../models");
const withBreaker = require("../circuit-breaker/breaker");
const redisClient = require("../redisClient");

const ticketsPOST = (ticketReq) => new Promise(
  async (resolve, reject) => {
    try {
      const {user_id, seat_number, price, status} = ticketReq.body
      const event_id = await redisClient.get(`reservation:${user_id}`)
      const ticketData = {event_id, user_id, seat_number, price, status}
      const newTicket = await ticket.create(ticketData)
      if (!newTicket){
        reject(Service.rejectResponse("Ticket haven't been created in db", 400))
      }
      resolve(Service.successResponse({ new_ticket: newTicket }));
    } catch (e) {
      console.log(e)
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405
      ));
    }
  }
);


const ticketsIdGET = (id) => new Promise(
  async (resolve, reject) => {
    try {
      const ticketId = id.id;
      const ticketData = await ticket.findOne({ where: { id: ticketId } });

      if (!ticketData) {
        return reject(Service.rejectResponse("Ticket not found", 404));
      }

      resolve(Service.successResponse({ ticketData }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405
      ));
    }
  }
);


const ticketsIdPATCH = (id) => new Promise(
  async (resolve, reject) => {
    try {
      const ticketId = id.id;
      const ticketData = id.body;
    
      const updated = await ticket.update(ticketData, { where: { id: ticketId } });

      if (updated[0] !== 1) {
        return reject(Service.rejectResponse("Ticket not found", 404));
      }

      resolve(Service.successResponse({ ticket: ticketData }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405
      ));
    }
  }
);


const ticketsIdDELETE = (id) => new Promise(
  async (resolve, reject) => {
    try {
      const ticketId = id.id;
      const deleted = await ticket.destroy({ where: { id: ticketId } });

      if (!deleted) {
        return reject(Service.rejectResponse("Ticket not found", 404));
      }

      resolve(Service.successResponse({ id }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405
      ));
    }
  }
);

module.exports = {
  ticketsPOST: (ticket) =>
    withBreaker(ticketsPOST)(ticket).catch((e) =>
      Promise.reject(Service.rejectResponse(e.message || "Invalid input", e.status || 405))
    ),
  ticketsIdGET: (id) =>
    withBreaker(ticketsIdGET)(id).catch((e) =>
      Promise.reject(Service.rejectResponse(e.message || "Invalid input", e.status || 405))
    ),
  ticketsIdPATCH: (id) =>
    withBreaker(ticketsIdPATCH)(id).catch((e) =>
      Promise.reject(Service.rejectResponse(e.message || "Invalid input", e.status || 405))
    ),
  ticketsIdDELETE: (id) =>
    withBreaker(ticketsIdDELETE)(id).catch((e) =>
      Promise.reject(Service.rejectResponse(e.message || "Invalid input", e.status || 405))
    ),
};
