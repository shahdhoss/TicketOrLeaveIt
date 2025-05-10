const {
   ticketsPOST,
   ticketsIdGET,
   ticketsIdPATCH,
   ticketsIdDELETE,
   ticketsHealth
} = require('../services/DefaultService');
const { extractUserFromToken } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

// Public routes
router.get("/health", (req, res) => {
    ticketsHealth().then((response) => res.json(response)).catch((error) => res.status(error.code || 500).json(error));
});

// Protected routes
router.post('/', extractUserFromToken, (req, res) => {
   const ticket = req.body;
   if (!ticket) {
       return res.status(400).json({ error: "Ticket data is required" });
   }
   ticketsPOST(ticket["body"])
       .then((response) => res.json(response))
       .catch((error) => res.status(error.code || 500).json(error));
});

router.get('/:id', extractUserFromToken, (req, res) => {
    const id = req.params;
    ticketsIdGET(id)
        .then((response) => res.json(response))
        .catch((error) => res.status(error.code || 500).json(error));
});

router.patch('/:id', extractUserFromToken, (req, res) => {
    const id = req.params;
    const ticket = req.body;
    ticketsIdPATCH(id, ticket["body"])
        .then((response) => res.json(response))
        .catch((error) => res.status(error.code || 500).json(error));
});

router.delete('/:id', extractUserFromToken, (req, res) => {
    const id = req.params;
    ticketsIdDELETE(id)
        .then((response) => res.json(response))
        .catch((error) => res.status(error.code || 500).json(error));
});

module.exports = router;
