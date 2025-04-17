const express = require('express');
const router = express.Router();

const TicketController = require('../controllers/DefaultController');
router.post('/reserve/:id', TicketController.reserveIdPOST);

router.patch('/reserve/:id', TicketController.reserveIdPATCH);

router.delete('/reserve/:id', TicketController.reserveIdDELETE);

router.get('/history', TicketController.historyGET);

router.post('/hold/:id', TicketController.holdIdPOST);

router.patch('/hold/:id', TicketController.holdIdPATCH);

router.delete('/hold/:id', TicketController.holdIdDELETE);

module.exports = router;