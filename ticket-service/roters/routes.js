// routers/ticket.routes.js
// CORRECTED VERSION - Use this code

const express = require('express');
const router = express.Router();

// Import the Controller - Assuming path '../controllers/DefaultController' is correct
const TicketController = require('../controllers/DefaultController');

// --- Define Routes using the CORRECT function names from DefaultController.js ---

// == Reservation Routes ==
// POST /reserve/:id maps to reserveIdPOST function in the controller
router.post('/reserve/:id', TicketController.reserveIdPOST);

// PATCH /reserve/:id maps to reserveIdPATCH function in the controller
router.patch('/reserve/:id', TicketController.reserveIdPATCH);

// DELETE /reserve/:id maps to reserveIdDELETE function in the controller
router.delete('/reserve/:id', TicketController.reserveIdDELETE);

// == History Route ==
// GET /history maps to historyGET function in the controller
router.get('/history', TicketController.historyGET);

// == Hold Routes ==
// POST /hold/:id maps to holdIdPOST function in the controller
router.post('/hold/:id', TicketController.holdIdPOST);

// PATCH /hold/:id maps to holdIdPATCH function in the controller
router.patch('/hold/:id', TicketController.holdIdPATCH);

// DELETE /hold/:id maps to holdIdDELETE function in the controller
router.delete('/hold/:id', TicketController.holdIdDELETE);


// --- Export the router ---
module.exports = router;