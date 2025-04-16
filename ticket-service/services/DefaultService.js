/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('../C:\Users\Rana7\OneDrive\Desktop\TicketOrLevet project\TicketOrLeaveIt\ticket-service\models');
const Reservation = db.Reservation;
/**
* Get the event history of a user
*
* returns List
* */
const historyGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete the holding of a ticket after it being fully reserved
*
* id Integer Deletes an event reservation using reservation id
* no response value expected for this operation
* */
const holdIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Update a user's ticket holding
*
* id Integer ID of the reservation to update
* reserveIdPatchRequest ReserveIdPatchRequest 
* no response value expected for this operation
* */
const holdIdPATCH = ({ id, reserveIdPatchRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        reserveIdPatchRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Hold a ticket or a number of tickets using reservation id
*
* id Integer ID of the event to reserve
* reserveIdPostRequest ReserveIdPostRequest 
* no response value expected for this operation
* */
const holdIdPOST = ({ id, reserveIdPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        reserveIdPostRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

const reserveIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
    
const reservationId = id; 


const userId = 1; 


const reservation = await Reservation.findByPk(reservationId);


if (!reservation) {
 
  return reject(Service.rejectResponse(
    'Reservation not found',
    404 
  ));
}


await reservation.destroy();


resolve(Service.successResponse(null, 204)); 

    } catch (e)
     {
      console.error("Error in reserveIdDELETE:", e); // Log the error
      reject(Service.rejectResponse(
        e.message || 'Internal Server Error deleting reservation.',
        e.status || 500));
     
    }
  },
);
/**
* Update a user's event reservation
*
* id Integer ID of the reservation to update
* reserveIdPatchRequest ReserveIdPatchRequest 
* no response value expected for this operation
* */
const reserveIdPATCH = ({ id, reserveIdPatchRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        reserveIdPatchRequest,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Reserve an event by event id
*
* id Integer ID of the event to reserve
* reserveIdPostRequest ReserveIdPostRequest 
* no response value expected for this operation
* */
const reserveIdPOST = ({ id, reserveIdPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      

      // 1. Extract data from input parameters
      const eventId = id; // The event ID from the path parameter
      const requestBody = reserveIdPostRequest; // The parsed JSON request body

      // Extract required fields from the request body
      // Make sure these names match the properties in your openapi spec's request body schema
      const { quantity, seat_type, seat_number } = requestBody;

      // --- IMPORTANT: Authentication ---
      // Using a placeholder user ID. Replace with real user ID logic later.
      const userId = 1; // <<< --- PLACEHOLDER - REPLACE LATER --- >>>

      // 2. Basic Validation
      if (!quantity || quantity <= 0 || !seat_type || !seat_number) {
        return reject(Service.rejectResponse(
          'Missing or invalid reservation data (quantity, seat_type, seat_number)',
          400 // Bad Request status code
        ));
      }

      // --- Optional: Add checks here if needed (e.g., call Event service) ---


      // 3. Create Reservation in Database using Sequelize
      const newReservation = await Reservation.create({
        eventId: eventId,         // from path param 'id'
        userId: userId,           // Use the actual authenticated user ID here later
        quantity: quantity,       // from request body
        seatType: seat_type,      // map spec 'seat_type' to model 'seatType'
        seatNumber: seat_number,  // map spec 'seat_number' to model 'seatNumber'
        status: 'confirmed'       // Set initial status
      });

      // 4. Success Response
      // Resolve with the created reservation data and 201 status
      resolve(Service.successResponse(newReservation.toJSON(), 201));

      // === END OF PASTED CODE ===

    } catch (e) {
      // Handle database errors or other unexpected errors
      console.error("Error in reserveIdPOST:", e); // Log the error for debugging
      reject(Service.rejectResponse(
        e.message || 'Internal Server Error creating reservation.', // Error message
        e.status || 500 // Status code (500 for general server errors)
      ));
    }
  },
);

module.exports = {
  historyGET,
  holdIdDELETE,
  holdIdPATCH,
  holdIdPOST,
  reserveIdDELETE,
  reserveIdPATCH,
  reserveIdPOST,
};
