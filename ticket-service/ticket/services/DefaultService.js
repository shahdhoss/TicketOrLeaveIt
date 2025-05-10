const Service = require('./Service');
const { ticket } = require("../models");
const withBreaker = require("../circuit-breaker/breaker");
const redisClient = require("../redisClient");
const sendReservationToPayments = require("../messaging/sendMessages")
const { v4: uuidv4 } = require('uuid');

const ticketsPOST = (ticketReq) => new Promise(
  async (resolve, reject) => {
    try {
      const {reservation_id, seat_number, price, status} = ticketReq.body
      console.log(reservation_id)
      const reservationData  = await redisClient.get(`reservation:${reservation_id}`)
      if (!reservationData) {
        throw new Error('Reservation not found in Redis');
      }
      const { user_id, event_id } = JSON.parse(reservationData);
      const ticket_id = uuidv4()
      const ticketData = {id: ticket_id, event_id, user_id, seat_number, price, status}
      const newTicket = await ticket.create(ticketData)
      if (!newTicket){
        reject(Service.rejectResponse("Ticket haven't been created in db", 400))
      }
      const message = {user_id: user_id, event_id: event_id, ticket_id:ticket_id, reservation_id:reservation_id ,amount: price}
      sendReservationToPayments(message)
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
const ticketsHealth = () => new Promise(
  async(resolve, reject)=>{
    try{
      resolve(Service.successResponse({ status: "ok"}));
    }catch(e){
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405
      ));
    }
  }
)

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
  ticketsHealth
};
