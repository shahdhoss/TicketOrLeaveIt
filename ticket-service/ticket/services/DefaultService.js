const Service = require('./Service');
const { users, tickets } = require("../models");
const withBreaker = require("../circuit_breaker/breaker");


const ticketsPOST = (ticket) => new Promise(
  async (resolve, reject) => {
    try {
      const {
        event_id,
        user_id,
        seat_number,
        price,
        status,
        purchased_at
      } = ticket.body.tickets;

      const newTicket = await tickets.create({
        event_id,
        user_id,
        seat_number,
        price,
        status,
        purchased_at
      });

      resolve(Service.successResponse({ ticket: newTicket }));
    } catch (e) {
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
      const ticket = await tickets.findOne({ where: { id: ticketId } });

      if (!ticket) {
        return reject(Service.rejectResponse("Ticket not found", 404));
      }

      resolve(Service.successResponse({ ticket }));
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
      const ticketData = id.body.tickets;

      const updated = await tickets.update(ticketData, { where: { id: ticketId } });

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
      const deleted = await tickets.destroy({ where: { id: ticketId } });

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


const usersIdDELETE = (id) => new Promise(
  async (resolve, reject) => {
    try {
      const userId = id.id;
      const deletedUser = await users.destroy({ where: { id: userId } });

      if (!deletedUser) {
        reject(Service.rejectResponse("user not found", "404"));
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

const usersIdGET = (id) => new Promise(
  async (resolve, reject) => {
    try {
      const userid = id.id;
      const user = await users.findOne({ where: { id: userid } });

      if (!user) {
        return reject(Service.rejectResponse("User not found", 404));
      }

      const { first_name, last_name, email, profilePicture } = user;
      const userData = { first_name, last_name, email, profilePicture };

      resolve(Service.successResponse({ user: userData }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405
      ));
    }
  }
);

const usersIdPATCH = (id) => new Promise(
  async (resolve, reject) => {
    try {
      const userId = id.id;
      const userData = id.body.users;

      const update = await users.update(userData, { where: { id: userId } });

      if (update[0] !== 1) {
        reject(Service.rejectResponse("user not found", "404"));
      }

      resolve(Service.successResponse({ user: userData }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405
      ));
    }
  }
);

const usersPOST = (user) => new Promise(
  async (resolve, reject) => {
    try {
      const { first_name, last_name, email, password } = user.body.users;
      const userData = { first_name, last_name, email, password };

      const userCreated = await users.create(userData);

      resolve(Service.successResponse({ user: userCreated }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405
      ));
    }
  }
);

module.exports = {
  usersIdDELETE: (id) =>
    withBreaker(usersIdDELETE)(id).catch((e) =>
      Promise.reject(Service.rejectResponse(e.message || "Invalid input", e.status || 405))
    ),
  usersIdGET: (id) =>
    withBreaker(usersIdGET)(id).catch((e) =>
      Promise.reject(Service.rejectResponse(e.message || "invalid input", e.status || 405))
    ),
  usersIdPATCH: (id) =>
    withBreaker(usersIdPATCH)(id).catch((e) =>
      Promise.reject(Service.rejectResponse(e.message || "invalid input", e.status || 405))
    ),
  usersPOST: (user) =>
    withBreaker(usersPOST)(user).catch((e) =>
      Promise.reject(Service.rejectResponse(e.message || "invalid input", e.status || 405))
    ),

 
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
