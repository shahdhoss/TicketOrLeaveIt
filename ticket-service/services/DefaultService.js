const Service = require('./Service');
const db = require('./models');
const Reservation = db.Reservation;
const Hold = db.Hold;

const historyGET = () => new Promise(
  async (resolve, reject) => {
    try {

const userId = 1; 


const userReservations = await Reservation.findAll({
  where: {
    userId: userId 
  },

  order: [
    ['createdAt', 'DESC']
  ]

});



const historyData = userReservations.map(reservation => reservation.toJSON()); // Get plain objects




resolve(Service.successResponse(historyData, 200));


    } catch (e) {
      console.error("Error in historyGET:", e); // Log the error
      reject(Service.rejectResponse(
        e.message || 'Internal Server Error retrieving history.',
        e.status || 500
      ));
    }
  },
);

const holdIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
     
    const holdId = id; 

    
    const userId = 1; 

 
    const hold = await Hold.findByPk(holdId);

    
    if (!hold) {

      return reject(Service.rejectResponse(
        'Hold not found',
        404 
      ));
    }

 
    await hold.destroy();

    
    resolve(Service.successResponse(null, 204)); 

    
    } catch (e) {
      console.error("Error in holdIdDELETE:", e); // Log the specific error
      reject(Service.rejectResponse(
        e.message || 'Internal Server Error deleting hold.', // Contextual error message
        e.status || 500
      ));
    }
  },
);

const holdIdPATCH = ({ id, reserveIdPatchRequest }) => new Promise(
  async (resolve, reject) => {
    try {
    
const holdId = id; 
const requestBody = reserveIdPatchRequest; 


const userId = 1; 


const hold = await Hold.findByPk(holdId);


if (!hold) {
  return reject(Service.rejectResponse('Hold not found', 404));
}


let changed = false; 
if (requestBody.quantity !== undefined) {
  if (requestBody.quantity <= 0) {
      return reject(Service.rejectResponse('Quantity must be positive', 400));
  }
  hold.quantity = requestBody.quantity;
  changed = true;
}
if (requestBody.seat_type !== undefined) {
  hold.seatType = requestBody.seat_type;
  changed = true;
}
if (requestBody.seat_number !== undefined) {
  hold.seatNumber = requestBody.seat_number;
  changed = true;
}


if (changed) {
  await hold.save();
}


resolve(Service.successResponse(hold.toJSON(), 200));


    } catch (e) {
      console.error("Error in holdIdPATCH:", e); // Log the specific error for debugging
      reject(Service.rejectResponse(
        e.message || 'Internal Server Error updating hold.', // Provide context in the error message
        e.status || 500 
      ));
    }
  },
);

const holdIdPOST = ({ id, reserveIdPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      
    const eventId = id; 
   
    const requestBody = reserveIdPostRequest; 


    const { quantity, seat_type, seat_number } = requestBody;

    
    const userId = 1;

  
    if (!quantity || quantity <= 0 || !seat_type || !seat_number) {
      return reject(Service.rejectResponse(
        'Missing or invalid hold data (quantity, seat_type, seat_number)',
        400 
      ));
    }


    const HOLD_DURATION_MS = 15 * 60 * 1000; 
    const expiresAt = new Date(Date.now() + HOLD_DURATION_MS);

    const newHold = await Hold.create({
      eventId: eventId,         // from path param 'id'
      userId: userId,           // Use the actual authenticated user ID here later
      quantity: quantity,       // from request body
      seatType: seat_type,      // map spec 'seat_type' to model 'seatType'
      seatNumber: seat_number,  // map spec 'seat_number' to model 'seatNumber'
      expiresAt: expiresAt      // Store the calculated expiry time
    });

    
    resolve(Service.successResponse(newHold.toJSON(), 201)); 

    
    } catch (e) {
     
     console.error("Error in holdIdPOST:", e); 
     reject(Service.rejectResponse(
       e.message || 'Internal Server Error creating hold.', 
       e.status || 500));
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

const reserveIdPATCH = ({ id, reserveIdPatchRequest }) => new Promise(
  async (resolve, reject) => {
    try {
    
const reservationId = id; 
const requestBody = reserveIdPatchRequest; 


const userId = 1; 


const reservation = await Reservation.findByPk(reservationId);


if (!reservation) {
  return reject(Service.rejectResponse(
    'Reservation not found',
    404 
  ));
}


if (requestBody.quantity !== undefined) {
  if (requestBody.quantity <= 0) {
      return reject(Service.rejectResponse('Quantity must be positive', 400));
  }
  reservation.quantity = requestBody.quantity;
}
if (requestBody.seat_type !== undefined) {
  reservation.seatType = requestBody.seat_type; // Map to model field name
}
if (requestBody.seat_number !== undefined) {
  reservation.seatNumber = requestBody.seat_number; // Map to model field name
}

await reservation.save();


resolve(Service.successResponse(reservation.toJSON(), 200)); 


    } catch (e) {
      console.error("Error in reserveIdPATCH:", e); // Log the error
      reject(Service.rejectResponse(
        e.message || 'Internal Server Error updating reservation.',
        e.status || 500
      ));
    }
  },
);

const reserveIdPOST = ({ id, reserveIdPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      


      const eventId = id; 
      const requestBody = reserveIdPostRequest; 

      const { quantity, seat_type, seat_number } = requestBody;


      const userId = 1; 

      
      if (!quantity || quantity <= 0 || !seat_type || !seat_number) {
        return reject(Service.rejectResponse(
          'Missing or invalid reservation data (quantity, seat_type, seat_number)',
          400 
        ));
      }

     
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
